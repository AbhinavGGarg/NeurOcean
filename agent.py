import json
import os
import re
from collections.abc import Iterable

from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

INTERVENTIONS = [
    "alkalinity_enhancement",
    "shading",
    "assisted_evolution",
    "pollution_reduction",
    "combined",
]

DEFAULT_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IS_VERCEL = bool(os.getenv("VERCEL")) or bool(os.getenv("VERCEL_ENV"))
DATA_DIR = os.getenv("NEUROCEAN_DATA_DIR") or ("/tmp/neurocean" if IS_VERCEL else BASE_DIR)
os.makedirs(DATA_DIR, exist_ok=True)
PROGRAM_FILE = os.path.join(DATA_DIR, "program.md")
DEFAULT_PROGRAM_FILE = os.path.join(BASE_DIR, "program.md")


def _model_candidates() -> list[str]:
    custom = os.getenv("NEUROCEAN_MODEL", "").strip()
    if custom:
        models = [m.strip() for m in custom.split(",") if m.strip()]
        if models:
            return models
    return DEFAULT_MODELS


def read_program() -> str:
    if not os.path.exists(PROGRAM_FILE) and os.path.exists(DEFAULT_PROGRAM_FILE):
        with open(DEFAULT_PROGRAM_FILE) as src, open(PROGRAM_FILE, "w") as dst:
            dst.write(src.read())
    if os.path.exists(PROGRAM_FILE):
        with open(PROGRAM_FILE) as f:
            return f.read()
    return "No program file found."


def _extract_text(response) -> str:
    text = (getattr(response, "text", "") or "").strip()
    if text:
        return text

    # Fallback extraction for SDK responses without .text convenience field
    candidates = getattr(response, "candidates", None)
    if not candidates:
        return ""

    parts: list[str] = []
    for candidate in candidates:
        content = getattr(candidate, "content", None)
        if not content:
            continue
        for part in getattr(content, "parts", []) or []:
            part_text = getattr(part, "text", None)
            if part_text:
                parts.append(part_text)

    return "\n".join(parts).strip()


def _invoke_model(prompt: str, temperature: float, json_mode: bool = False) -> str:
    last_error: Exception | None = None
    config: dict = {"temperature": temperature}

    if json_mode:
        # Ask Gemini for proper machine-parseable JSON.
        config["response_mime_type"] = "application/json"

    for model in _model_candidates():
        try:
            response = client.models.generate_content(model=model, contents=prompt, config=config)
            text = _extract_text(response)
            if text:
                return text
            last_error = RuntimeError(f"Empty response from model {model}")
        except Exception as exc:  # pragma: no cover - runtime API/network branch
            last_error = exc

    if last_error:
        raise last_error
    raise RuntimeError("No model candidates available.")


def _strip_json_wrappers(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
    return cleaned.strip()


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def _to_float(value, default: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _looks_gibberish(text: str) -> bool:
    normalized = re.sub(r"\s+", " ", text).strip()
    if len(normalized) < 25:
        return False

    words = re.findall(r"[A-Za-z]{3,}", normalized)
    if len(words) < 6:
        return False

    vowel_words = sum(1 for w in words if re.search(r"[aeiouAEIOU]", w))
    vowel_ratio = vowel_words / max(len(words), 1)

    long_consonant_chunks = re.findall(r"\b[bcdfghjklmnpqrstvwxyz]{6,}\b", normalized, flags=re.IGNORECASE)
    repeated_symbols = re.findall(r"[_`~|^<>]{2,}", normalized)

    alpha_count = sum(ch.isalpha() for ch in normalized)
    punct_count = sum(ch in ",.;:!?-" for ch in normalized)
    punct_ratio = punct_count / max(alpha_count, 1)

    if vowel_ratio < 0.56:
        return True
    if long_consonant_chunks:
        return True
    if repeated_symbols:
        return True
    if punct_ratio > 0.22:
        return True

    return False


def _clean_text(text: str, fallback: str, max_len: int = 420) -> str:
    cleaned = re.sub(r"\s+", " ", (text or "")).strip()
    cleaned = cleaned.replace(" ,", ",").replace(" .", ".")
    if not cleaned or _looks_gibberish(cleaned):
        return fallback
    return cleaned[:max_len]


def _pick_intervention(reef_state: dict) -> str:
    dhw = _to_float(reef_state.get("dhw", 0.0), 0.0)
    omega = _to_float(reef_state.get("omega_arag", 2.6), 2.6)
    water_quality = _to_float(reef_state.get("water_quality", 0.45), 0.45)
    adapt = _to_float(reef_state.get("adaptation_score", 0.15), 0.15)

    if dhw >= 1.5:
        return "shading"
    if omega < 3.0:
        return "alkalinity_enhancement"
    if water_quality < 0.55:
        return "pollution_reduction"
    if adapt < 0.35:
        return "assisted_evolution"
    return "combined"


def _fallback_hypothesis(reef_state: dict, intervention: str) -> str:
    dhw = _to_float(reef_state.get("dhw", 0.0), 0.0)
    omega = _to_float(reef_state.get("omega_arag", 2.6), 2.6)
    return (
        f"Applying {intervention} should reduce immediate stress and improve recovery indicators "
        f"while DHW is {dhw:.2f} and omega_arag is {omega:.2f}."
    )


def _fallback_reasoning(reef_state: dict, intervention: str) -> str:
    dhw = _to_float(reef_state.get("dhw", 0.0), 0.0)
    omega = _to_float(reef_state.get("omega_arag", 2.6), 2.6)
    water_quality = _to_float(reef_state.get("water_quality", 0.45), 0.45)
    return (
        f"Current DHW={dhw:.2f}, omega_arag={omega:.2f}, and water_quality={water_quality:.2f}. "
        f"Chosen intervention {intervention} targets the most constrained reef pathway first, "
        "then supports biodiversity and coral cover stabilization."
    )


def _normalize_decision(raw: dict, reef_state: dict) -> dict:
    intervention = raw.get("intervention")
    if intervention not in INTERVENTIONS:
        intervention = _pick_intervention(reef_state)

    default_intensity = 0.72 if intervention == "combined" else 0.68
    intensity = _clamp(_to_float(raw.get("intensity"), default_intensity), 0.35, 1.0)

    fallback_h = _fallback_hypothesis(reef_state, intervention)
    fallback_r = _fallback_reasoning(reef_state, intervention)

    hypothesis = _clean_text(str(raw.get("hypothesis", "")), fallback_h, max_len=220)
    reasoning = _clean_text(str(raw.get("reasoning", "")), fallback_r, max_len=420)

    return {
        "hypothesis": hypothesis,
        "intervention": intervention,
        "intensity": round(intensity, 2),
        "reasoning": reasoning,
    }


def _parse_json_dict(raw_text: str) -> dict:
    cleaned = _strip_json_wrappers(raw_text)
    parsed = json.loads(cleaned)
    if not isinstance(parsed, dict):
        raise ValueError("Model JSON response is not an object.")
    return parsed


def _is_valid_program_markdown(markdown: str) -> bool:
    if not markdown.startswith("# NeurOcean Research Program"):
        return False
    if "## Mission" not in markdown:
        return False
    if _looks_gibberish(markdown):
        return False
    return True


def _history_lines(experiment_history: Iterable[dict]) -> str:
    lines = []
    for e in list(experiment_history)[-6:]:
        s = e.get("state_after", {})
        lines.append(
            f"- Cycle {e.get('cycle', '?')}: {e.get('intervention', '?')} @ {e.get('intensity', '?')} "
            f"→ reward {e.get('reward', '?')} | kept: {e.get('kept', '?')} | "
            f"bleaching {s.get('bleaching_pct', '?')}% | DHW {s.get('dhw', '?')} | "
            f"pH {s.get('ph', '?')} | omega {s.get('omega_arag', '?')} | "
            f"wq {round(_to_float(s.get('water_quality', 0), 0.0), 3)} | "
            f"adapt {round(_to_float(s.get('adaptation_score', 0), 0.0), 3)} | "
            f"species {s.get('species_count', '?')} | cover {s.get('coral_cover_pct', '?')}%"
        )
    return "\n".join(lines)


def get_agent_decision(reef_state: dict, experiment_history: list) -> dict:
    program = read_program()

    tried_interventions = {e.get("intervention") for e in experiment_history} if experiment_history else set()
    untried = [i for i in INTERVENTIONS if i not in tried_interventions]

    last3 = [e.get("intervention") for e in experiment_history[-3:]] if len(experiment_history) >= 3 else []
    stuck = len(set(last3)) == 1 and len(last3) == 3

    rs = reef_state
    dhw = _to_float(rs.get("dhw", 0.0), 0.0)
    omega = _to_float(rs.get("omega_arag", 2.6), 2.6)
    wq = round(_to_float(rs.get("water_quality", 0.45), 0.45), 3)
    adapt = round(_to_float(rs.get("adaptation_score", 0.15), 0.15), 3)

    decision_prompt = f"""You are an autonomous AI marine biologist running NeurOcean.

=== RESEARCH PROGRAM ===
{program}
========================

CURRENT REEF STATE (cycle {len(experiment_history) + 1}):
Core metrics:
- Bleaching:         {rs['bleaching_pct']}%  (target: 0%, higher = worse)
- Coral cover:       {rs['coral_cover_pct']}%  (target: 60%+)
- Species count:     {rs['species_count']}  (target: 35+)

Climate & chemistry:
- DHW (heat stress): {dhw}  (DANGER if >4, MORTALITY if >8, target: <2)
- Temperature:       {rs['temperature_c']}°C  (bleaching threshold: 29°C)
- pH:                {rs['ph']}  (healthy: 8.1-8.3)
- omega_arag:        {omega}  (target: 3.5)

Resilience indicators:
- Water quality:     {wq}  (0-1 scale, target: 0.8+)
- Adaptation score:  {adapt}  (target: 0.5+)

IMPORTANT CONTEXT:
- Climate forcing worsens the reef every step.
- Shading reduces DHW and temperature.
- Combined addresses DHW + water quality + adaptation.
- Alkalinity enhancement raises omega_arag and pH.

RECENT HISTORY:
{_history_lines(experiment_history) or 'No experiments yet.'}

{"UNTRIED INTERVENTIONS: " + ", ".join(untried) if untried else ""}
{"WARNING: Same intervention 3 cycles in a row — switch now." if stuck else ""}

AVAILABLE INTERVENTIONS: {", ".join(INTERVENTIONS)}

Return ONLY valid JSON with this exact shape and concise plain English:
{{
  "hypothesis": "one sentence",
  "intervention": "exact name from list",
  "intensity": 0.75,
  "reasoning": "two short sentences"
}}"""

    fallback_intervention = _pick_intervention(reef_state)
    decision = {
        "hypothesis": _fallback_hypothesis(reef_state, fallback_intervention),
        "intervention": fallback_intervention,
        "intensity": 0.72 if fallback_intervention == "combined" else 0.68,
        "reasoning": _fallback_reasoning(reef_state, fallback_intervention),
    }

    try:
        raw_decision_text = _invoke_model(decision_prompt, temperature=0.35, json_mode=True)
        parsed = _parse_json_dict(raw_decision_text)
        decision = _normalize_decision(parsed, reef_state)
    except Exception as exc:  # pragma: no cover - runtime API/network branch
        print(f"  ⚠️ Decision generation failed, using safe fallback: {exc}")
        decision = _normalize_decision(decision, reef_state)

    rewrite_prompt = f"""You are an autonomous AI marine biologist.
Rewrite the research program below based on the latest validated decision.

DECISION:
- intervention: {decision['intervention']}
- intensity: {decision['intensity']}
- hypothesis: {decision['hypothesis']}
- reasoning: {decision['reasoning']}

CURRENT REEF STATE:
- Bleaching: {rs['bleaching_pct']}% | DHW: {dhw} | pH: {rs['ph']} | omega_arag: {omega}
- water_quality: {wq} | adaptation_score: {adapt}
- Species: {rs['species_count']} | Coral cover: {rs['coral_cover_pct']}%

CURRENT PROGRAM TO UPDATE:
{program}

Rules:
- Keep the Mission section unchanged.
- Consolidate repeated findings.
- Keep markdown under 85 lines.
- Preserve headings and scientific clarity.
- Output ONLY raw markdown starting with '# NeurOcean Research Program'."""

    try:
        new_program = _invoke_model(rewrite_prompt, temperature=0.45, json_mode=False).strip()
        if new_program.startswith("```"):
            new_program = new_program.split("```", 1)[1]
            if "\n" in new_program:
                new_program = new_program.split("\n", 1)[1]
            new_program = new_program.rsplit("```", 1)[0].strip()

        if _is_valid_program_markdown(new_program):
            with open(PROGRAM_FILE, "w") as f:
                f.write(new_program)
        else:
            print("  ⚠️ program.md rewrite looked malformed or noisy — kept previous version")
    except Exception as exc:  # pragma: no cover - runtime API/network branch
        print(f"  ⚠️ program.md rewrite failed — kept previous version: {exc}")

    return decision

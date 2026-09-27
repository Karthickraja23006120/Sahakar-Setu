// lib/matching.js
//
// Transparent, explainable skill-matching engine.
//
// Per the pitch doc's own guidance (section 10/Q9): for the prototype we do
// NOT claim a trained ML ranking model. Instead we use a weighted
// skill-vector similarity score that is fully explainable to a trainee or
// counselor. As verified training/employment outcome data accumulates
// (Digital Skill Passport + analytics warehouse), this function is the
// natural place to swap in a learned ranking model without changing the API
// contract (input: candidate skills, job requirements -> output: score + gaps).

/**
 * @param {Object.<string, number>} candidateSkills  e.g. { python: 0.9, sql: 0.8 }
 * @param {Object.<string, number>} requiredSkills   e.g. { python: 0.9, powerbi: 0.8 }
 */
export function matchScore(candidateSkills, requiredSkills) {
  const requiredKeys = Object.keys(requiredSkills);
  if (requiredKeys.length === 0) return { score: 0, gaps: [], matched: [] };

  let weightedSum = 0;
  let totalWeight = 0;
  const gaps = [];
  const matched = [];

  for (const skill of requiredKeys) {
    const required = requiredSkills[skill];
    const have = candidateSkills[skill] || 0;
    totalWeight += required;
    weightedSum += Math.min(have, required);

    if (have + 0.15 < required) {
      gaps.push({
        skill,
        required,
        current: have,
        gap: Number((required - have).toFixed(2)),
      });
    } else {
      matched.push({ skill, required, current: have });
    }
  }

  const score = totalWeight > 0 ? weightedSum / totalWeight : 0;

  return {
    score: Number(score.toFixed(3)), // 0..1, explainable weighted overlap
    matched,
    gaps: gaps.sort((a, b) => b.gap - a.gap),
  };
}

/**
 * Ranks every job in `jobs` against a candidate's skills and returns the
 * sorted list with score + skill gaps + a plain-language recommendation.
 */
export function rankJobs(candidateSkills, jobs) {
  return jobs
    .map((job) => {
      const result = matchScore(candidateSkills, job.requiredSkills);
      return {
        jobId: job.id,
        title: job.title,
        employer: job.employer,
        location: job.location,
        score: result.score,
        matched: result.matched,
        gaps: result.gaps,
        recommendation:
          result.gaps.length === 0
            ? "Strong match - no significant skill gaps."
            : `Consider training in: ${result.gaps
                .slice(0, 3)
                .map((g) => g.skill)
                .join(", ")}`,
      };
    })
    .sort((a, b) => b.score - a.score);
}

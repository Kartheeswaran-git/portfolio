import { useState, useEffect } from "react";
import usePortfolioData from "../hooks/usePortfolioData";
import { FaGitAlt } from "react-icons/fa";
import "./Section.css";

const TechnicalSkills = () => {
  const { data } = usePortfolioData();
  const { skills } = data;

  const githubUsername = "Kartheeswaran-git";
  const leetcodeUsername = "YHwFohqRdR";

  const [githubProfile, setGithubProfile] = useState(null);
  const [recentPushes, setRecentPushes] = useState([]);
  const [githubContributions, setGithubContributions] = useState(null);
  const [leetcodeProfile, setLeetcodeProfile] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [leetcodeCalendar, setLeetcodeCalendar] = useState(null);

  useEffect(() => {
    // Fetch GitHub profile
    fetch(`https://api.github.com/users/${githubUsername}`)
      .then(res => res.json())
      .then(profile => {
        if (profile && profile.public_repos !== undefined) {
          setGithubProfile(profile);
        } else {
          // Rate limit or error fallback
          setGithubProfile({
            public_repos: 18,
            followers: 17,
            following: 17
          });
        }
      })
      .catch(() => {
        setGithubProfile({
          public_repos: 18,
          followers: 17,
          following: 17
        });
      });

    // Fetch total contributions
    fetch(`https://github-contributions-api.deno.dev/${githubUsername}.json`)
      .then(res => res.json())
      .then(data => {
        if (data && data.totalContributions !== undefined) {
          setGithubContributions(data.totalContributions);
        } else {
          setGithubContributions(370);
        }
      })
      .catch(() => {
        setGithubContributions(370);
      });

    // Fetch recent push events
    fetch(`https://api.github.com/users/${githubUsername}/events/public`)
      .then(res => res.json())
      .then(events => {
        if (Array.isArray(events)) {
          const pushEvents = events
            .filter(e => e.type === 'PushEvent')
            .slice(0, 3)
            .map(e => ({
              repo: e.repo.name.replace(`${githubUsername}/`, ''),
              date: new Date(e.created_at),
              commits: Math.max(1, e.payload.commits?.length || 0),
              message: e.payload.commits?.[0]?.message || ''
            }));
          setRecentPushes(pushEvents);
        } else {
          // Rate limit fallback recent pushes
          setRecentPushes([
            { repo: "smart_irrigation", commits: 3, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { repo: "Odoo-Hackathon", commits: 1, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
            { repo: "Odoo-Hackathon", commits: 2, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) }
          ]);
        }
      })
      .catch(() => {
        setRecentPushes([
          { repo: "smart_irrigation", commits: 3, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { repo: "Odoo-Hackathon", commits: 1, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          { repo: "Odoo-Hackathon", commits: 2, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) }
        ]);
      });

    // Fetch LeetCode stats and submissions
    fetch(`https://leetcode-api-faisalshohag.vercel.app/${leetcodeUsername}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setLeetcodeProfile({
            totalSolved: data.totalSolved,
            easySolved: data.easySolved,
            mediumSolved: data.mediumSolved,
            hardSolved: data.hardSolved
          });
          const acceptedSubmissions = (data.recentSubmissions || [])
            .filter(sub => sub.statusDisplay === 'Accepted')
            .slice(0, 3)
            .map(sub => ({
              title: sub.title,
              lang: sub.lang,
              date: new Date(Number(sub.timestamp) * 1000)
            }));
          setRecentSubmissions(acceptedSubmissions);
          setLeetcodeCalendar(data.submissionCalendar || {});
        }
      })
      .catch(() => {});
  }, []);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const renderLeetcodeHeatmap = () => {
    if (!leetcodeProfile || !leetcodeCalendar) return null;

    // Calculate dates for 53 weeks (Sunday to Saturday) ending this week
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sun, ..., 6 = Sat
    // Start date is 52 weeks ago Sunday
    const startDate = new Date(today.getTime() - (52 * 7 + currentDayOfWeek) * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0);

    const columns = [];
    let currentWeek = [];

    // Loop through 371 days (53 weeks * 7 days)
    for (let i = 0; i < 371; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      // Get UTC midnight timestamp in seconds
      const utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000;
      const count = leetcodeCalendar[utcMidnight] || 0;

      let color = "#eeeeee";
      if (count > 0 && count <= 2) color = "#ffc4c4";
      else if (count > 2 && count <= 5) color = "#ff8a8a";
      else if (count > 5 && count <= 8) color = "#ff4d4d";
      else if (count > 8) color = "#dc2626";

      currentWeek.push({
        date,
        count,
        color
      });

      if (currentWeek.length === 7) {
        columns.push(currentWeek);
        currentWeek = [];
      }
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthLabels = [];
    
    columns.forEach((week, w) => {
      const wednesday = week[3].date;
      const month = wednesday.getMonth();
      let isMonthStart = false;

      if (w === 0) {
        let nextMonthStartW = 0;
        for (let nextW = 1; nextW < columns.length; nextW++) {
          if (columns[nextW][3].date.getMonth() !== month) {
            nextMonthStartW = nextW;
            break;
          }
        }
        if (nextMonthStartW >= 3) {
          isMonthStart = true;
        }
      } else {
        const prevWednesday = columns[w - 1][3].date;
        if (month !== prevWednesday.getMonth()) {
          isMonthStart = true;
        }
      }

      if (isMonthStart) {
        monthLabels.push({ x: 27 + w * 12, label: monthNames[month] });
      }
    });

    return (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="663" height="104" viewBox="0 0 663 104" className="heatmap-img-simple">
        {/* Month Labels */}
        {monthLabels.map((m, idx) => (
          <text key={idx} x={m.x} y="10" style={{ fill: "#767676", fontSize: "9px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }}>
            {m.label}
          </text>
        ))}

        {/* Day Labels */}
        <text style={{ fill: "#767676", fontSize: "9px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }} x="0" y="40">Mon</text>
        <text style={{ fill: "#767676", fontSize: "9px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }} x="0" y="64">Wed</text>
        <text style={{ fill: "#767676", fontSize: "9px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }} x="0" y="89">Fri</text>

        {/* Heatmap Blocks */}
        {columns.map((week, w) => (
          <g key={w}>
            {week.map((day, d) => (
              <rect
                key={d}
                style={{ fill: day.color, shapeRendering: "crispedges" }}
                x={27 + w * 12}
                y={17 + d * 12}
                width="10"
                height="10"
              />
            ))}
          </g>
        ))}
      </svg>
    );
  };

  return (
    <section id="skills-section" className="section-card animate-slideUp">
      <h2 className="section-title">Technical Skills</h2>

      <div className="skills-list">
        {skills.map((skill, index) => (
          <div className="skill-list-item" key={index}>
            <div className="skill-list-icon">
              {skill.name ? skill.name.charAt(0) : "?"}
            </div>

            <div className="skill-list-content">
              <div className="skill-list-title">{skill.name || "Unknown Skill"}</div>
              {skill.exp && <div className="skill-list-meta">{skill.exp}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Heatmaps */}
      <div className="heatmap-section">
        <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer" className="heatmap-card-simple animate-slideUp">
          <div className="heatmap-label">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>{githubUsername}</span>
          </div>

          {/* GitHub Stats */}
          {githubProfile && (
            <div className="gh-stats-row">
              {githubContributions !== null && (
                <div className="gh-stat-card-item">
                  <span className="gh-stat-value">{githubContributions}</span>
                  <span className="gh-stat-label">Contributions</span>
                </div>
              )}
              <div className="gh-stat-card-item">
                <span className="gh-stat-value">{githubProfile.public_repos}</span>
                <span className="gh-stat-label">Repos</span>
              </div>
              <div className="gh-stat-card-item">
                <span className="gh-stat-value">{githubProfile.followers}</span>
                <span className="gh-stat-label">Followers</span>
              </div>
              <div className="gh-stat-card-item">
                <span className="gh-stat-value">{githubProfile.following}</span>
                <span className="gh-stat-label">Following</span>
              </div>
            </div>
          )}

          {/* Recent Pushes */}
          {recentPushes.length > 0 && (
            <div className="gh-pushes">
              {recentPushes.map((push, i) => (
                <div className="gh-push-item" key={i}>
                  <div className="gh-push-icon">
                    <FaGitAlt size={14} />
                  </div>
                  <div className="gh-push-content">
                    <div className="gh-push-title">{push.repo}</div>
                    <div className="gh-push-meta">{push.commits} commit{push.commits !== 1 ? 's' : ''} · {timeAgo(push.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <img
            src={`https://ghchart.rshah.org/dc2626/${githubUsername}`}
            alt="GitHub Contribution Graph"
            className="heatmap-img-simple"
            loading="lazy"
          />
        </a>

        <a href={`https://leetcode.com/u/${leetcodeUsername}/`} target="_blank" rel="noopener noreferrer" className="heatmap-card-simple animate-slideUp" style={{ animationDelay: '0.15s' }}>
          <div className="heatmap-label">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
            </svg>
            <span>Kartheeswaran S</span>
          </div>

          {/* LeetCode Stats */}
          {leetcodeProfile && (
            <div className="gh-stats-row">
              <div className="gh-stat-card-item">
                <span className="gh-stat-value">{leetcodeProfile.totalSolved}</span>
                <span className="gh-stat-label">Solved</span>
              </div>
              <div className="gh-stat-card-item">
                <span className="gh-stat-value">{leetcodeProfile.easySolved}</span>
                <span className="gh-stat-label">Easy</span>
              </div>
              <div className="gh-stat-card-item">
                <span className="gh-stat-value">{leetcodeProfile.mediumSolved}</span>
                <span className="gh-stat-label">Medium</span>
              </div>
              <div className="gh-stat-card-item">
                <span className="gh-stat-value">{leetcodeProfile.hardSolved}</span>
                <span className="gh-stat-label">Hard</span>
              </div>
            </div>
          )}

          {/* LeetCode Recent Submissions */}
          {recentSubmissions.length > 0 && (
            <div className="gh-pushes">
              {recentSubmissions.map((sub, i) => (
                <div className="gh-push-item" key={i}>
                  <div className="gh-push-icon" style={{ background: '#dc2626' }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                    </svg>
                  </div>
                  <div className="gh-push-content">
                    <div className="gh-push-title">{sub.title}</div>
                    <div className="gh-push-meta">Accepted ({sub.lang}) · {timeAgo(sub.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {leetcodeCalendar ? (
            renderLeetcodeHeatmap()
          ) : (
            <div className="flex items-center justify-center p-8">
              <span className="text-slate-400">Loading LeetCode heatmap...</span>
            </div>
          )}
        </a>
      </div>
    </section>
  );
};

export default TechnicalSkills;

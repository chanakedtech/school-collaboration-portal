import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardCard({ title, value, caption, icon: Icon, href, accent = "#1d6157", trend }) {
  const inner = (
    <article className="dashboard-card" style={{ "--card-accent": accent }}>
      <div className="dashboard-card-top">
        <span className="dashboard-card-title">{title}</span>
        {Icon && (
          <span className="dashboard-card-icon-wrap" style={{ background: accent + "1a", color: accent }}>
            <Icon size={18} />
          </span>
        )}
      </div>

      <div className="dashboard-card-body">
        <strong className="dashboard-card-value">{value}</strong>
        {trend !== undefined && (
          <span className={`dashboard-card-trend ${trend >= 0 ? "trend--up" : "trend--down"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="dashboard-card-footer">
        <p className="dashboard-card-caption">{caption}</p>
        {href && (
          <span className="dashboard-card-cta" style={{ color: accent }}>
            View <ChevronRight size={13} />
          </span>
        )}
      </div>
    </article>
  );

  return href ? (
    <Link to={href} className="dashboard-card-wrap">{inner}</Link>
  ) : (
    <div className="dashboard-card-wrap">{inner}</div>
  );
}

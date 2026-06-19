import {
  DollarSign,
  Percent,
  Users,
  Tag,
  Wallet,
  TrendingUp,
  BadgePercent,
  Landmark,
  Activity,
} from "lucide-react";

// The API never sends icon data — only { id, label, value } — so we infer
// a sensible icon from the metric's exact label text. Any label we don't
// recognize falls back to a generic icon instead of rendering nothing,
// so a new/unexpected metric from the API doesn't break the layout.
const ICON_BY_LABEL = {
  "Total Balance": DollarSign,
  "Discount Percentage": Percent,
  "Total Referral": Users,
  "Discount Amount": Tag,
  "Commission Amount": Wallet,
  "Total Earning": TrendingUp,
  "Commission Discount": BadgePercent,
  "Total Bank Transfer": Landmark,
};

function MetricIcon({ label }) {
  const IconComponent = ICON_BY_LABEL[label] || Activity;
  return (
    <span className="metric-icon">
      <IconComponent size={18} />
    </span>
  );
}

export default MetricIcon;
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReferralsTable from "../components/ReferralsTable";
import MetricIcon from "../components/MetricIcon";
import { fetchReferrals, extractReferralsPayload } from "../api/client";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [serviceSummary, setServiceSummary] = useState(null);
  const [referral, setReferral] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadDashboard() {
      setIsLoading(true);
      setErrorInfo(null);

      const token = Cookies.get("jwt_token");

      try {
        const { response, responseJson } = await fetchReferrals(token);

        if (isCancelled) return;

        if (!response.ok) {
          setErrorInfo({
            message: responseJson?.message || "Failed to load dashboard data",
            status: response.status,
          });
          setIsLoading(false);
          return;
        }

        const payload = extractReferralsPayload(responseJson);
        setMetrics(payload.metrics);
        setServiceSummary(payload.serviceSummary);
        setReferral(payload.referral);
      } catch (error) {
        if (!isCancelled) {
          setErrorInfo({ message: "Network error. Please try again.", status: null });
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadDashboard();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <h1>Referral Dashboard</h1>
        <p className="page-subtitle">
          Track your referrals, earnings, and partner activity in one place.
        </p>

        {isLoading && <p className="loading-text">Loading dashboard…</p>}

        {errorInfo && (
          <p role="alert" className="error-banner">
            {errorInfo.message}
            {errorInfo.status ? ` (Status ${errorInfo.status})` : ""}
          </p>
        )}

        {!isLoading && !errorInfo && (
          <>
            <section aria-label="Overview metrics" className="overview-section">
              <h2>Overview</h2>
              <div className="metrics-grid">
                {metrics.map((metric) => (
                 <div className="metric-card" key={metric.id}>
                    <MetricIcon label={metric.label} />
                    <div className="metric-value">{metric.value}</div>
                    <div className="metric-label">{metric.label}</div>
                </div>
                ))}
              </div>
            </section>

            {serviceSummary && (
              <section aria-label="Service summary" className="service-summary-section">
                <h2>Service summary</h2>
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="summary-label">Service</div>
                    <div className="summary-value">{serviceSummary.service}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Your Referrals</div>
                    <div className="summary-value">{serviceSummary.yourReferrals}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Active Referrals</div>
                    <div className="summary-value">{serviceSummary.activeReferrals}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Total Ref. Earnings</div>
                    <div className="summary-value">{serviceSummary.totalRefEarnings}</div>
                  </div>
                </div>
              </section>
            )}

            {referral && (
              <section aria-label="Share referral" className="share-section">
                <h2>Refer friends and earn more</h2>
                <div className="share-grid">
                  <div className="share-field">
                    <label htmlFor="referral-link">Your Referral Link</label>
                    <div className="share-row">
                      <input id="referral-link" type="text" readOnly value={referral.link} />
                      <button type="button" onClick={() => handleCopy(referral.link)}>
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="share-field">
                    <label htmlFor="referral-code">Your Referral Code</label>
                    <div className="share-row">
                      <input id="referral-code" type="text" readOnly value={referral.code} />
                      <button type="button" onClick={() => handleCopy(referral.code)}>
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
            <ReferralsTable />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
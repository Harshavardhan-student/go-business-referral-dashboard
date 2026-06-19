import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchReferrals, extractSingleReferral } from "../api/client";
import { formatDate, formatProfit } from "../utils/format";

function ReferralDetail() {
  const { id } = useParams();
  const [referral, setReferral] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadReferral() {
      setIsLoading(true);
      setNotFound(false);
      setReferral(null);

      const token = Cookies.get("jwt_token");

      try {
        const { response, responseJson } = await fetchReferrals(token, { id });

        if (isCancelled) return;

        if (!response.ok) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        const match = extractSingleReferral(responseJson, id);

        if (!match) {
          setNotFound(true);
        } else {
          setReferral(match);
        }
      } catch (error) {
        if (!isCancelled) setNotFound(true);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadReferral();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <Link to="/" className="back-link">
          ← Back to dashboard
        </Link>

        {isLoading && <p className="loading-text">Loading…</p>}

        {!isLoading && notFound && (
          <div className="detail-not-found">
            <h1>Referral not found</h1>
          </div>
        )}

        {!isLoading && !notFound && referral && (
          <>
            <h1>Referral Details</h1>
            <p className="page-subtitle">Full information for this referral partner.</p>

            <div className="detail-card">
              <div className="detail-card-header">
                <h2>{referral.name}</h2>
                <span className="service-badge">{referral.serviceName}</span>
              </div>

              <dl className="detail-list">
                <div className="detail-row">
                  <dt>Referral ID</dt>
                  <dd>{referral.id}</dd>
                </div>
                <div className="detail-row">
                  <dt>Name</dt>
                  <dd>{referral.name}</dd>
                </div>
                <div className="detail-row">
                  <dt>Service Name</dt>
                  <dd>{referral.serviceName}</dd>
                </div>
                <div className="detail-row">
                  <dt>Date</dt>
                  <dd>{formatDate(referral.date)}</dd>
                </div>
                <div className="detail-row">
                  <dt>Profit</dt>
                  <dd>{formatProfit(referral.profit)}</dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ReferralDetail;
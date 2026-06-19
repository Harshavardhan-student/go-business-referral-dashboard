import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { fetchReferrals, extractReferralsPayload } from "../api/client";
import { formatDate, formatProfit } from "../utils/format";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const ROWS_PER_PAGE = 10;

function ReferralsTable() {
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;

    async function loadReferrals() {
      setIsLoading(true);
      setErrorInfo(null);

      const token = Cookies.get("jwt_token");

      try {
        const { response, responseJson } = await fetchReferrals(token, {
          search: debouncedSearch,
          sort: sortOrder,
        });

        if (isCancelled) return;

        if (!response.ok) {
          setErrorInfo({
            message: responseJson?.message || "Failed to load referrals",
            status: response.status,
          });
          setReferrals([]);
          setIsLoading(false);
          return;
        }

        const payload = extractReferralsPayload(responseJson);
        setReferrals(payload.referrals);
        setCurrentPage(1); // fresh search/sort = fresh view, always start at page 1
      } catch (error) {
        if (!isCancelled) {
          setErrorInfo({ message: "Network error. Please try again.", status: null });
          setReferrals([]);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadReferrals();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, sortOrder]);

  const handleRowClick = (id) => {
    navigate(`/referral/${id}`);
  };

  // ---- Client-side pagination math (no API call involved) ----
  const totalEntries = referrals.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / ROWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, totalEntries);
  const visibleRows = referrals.slice(startIndex, endIndex);

  const goToPage = (page) => setCurrentPage(page);
  const goPrevious = () => setCurrentPage((page) => Math.max(1, page - 1));
  const goNext = () => setCurrentPage((page) => Math.min(totalPages, page + 1));

  return (
    <section aria-label="All referrals" className="referrals-section">
      <h2>All referrals</h2>

      <div className="referrals-controls">
        <div className="search-field">
            <label htmlFor="referral-search">Search</label>
            <div className="search-input-wrapper">
                <input
                id="referral-search"
                type="text"
                placeholder="Name or service…"
                aria-label="Search referrals"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                />
                {searchInput && (
                <button
                    type="button"
                    className="search-clear-btn"
                    aria-label="Clear search"
                    onClick={() => setSearchInput("")}
                >
                    ✕
                </button>
                )}
            </div>
        </div>

        <div className="sort-field">
          <label htmlFor="referral-sort">Sort by date</label>
          <select
            id="referral-sort"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>

      {errorInfo && (
        <p role="alert" className="error-banner">
          {errorInfo.message}
          {errorInfo.status ? ` (Status ${errorInfo.status})` : ""}
        </p>
      )}

      <div className="referrals-table-wrapper">
        <table className="referrals-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Service</th>
              <th>Date</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4}>Loading…</td>
              </tr>
            )}

            {!isLoading && !errorInfo && visibleRows.length === 0 && (
              <tr>
                <td colSpan={4}>No matching entries</td>
              </tr>
            )}

            {!isLoading &&
              !errorInfo &&
              visibleRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  className="referral-row"
                >
                  <td>{row.name}</td>
                  <td>{row.serviceName}</td>
                  <td>{formatDate(row.date)}</td>
                  <td className="profit-cell">{formatProfit(row.profit)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && !errorInfo && totalEntries > 0 && (
        <div className="table-footer">
          <span className="entries-summary">
            Showing {startIndex + 1}–{endIndex} of {totalEntries} entries
          </span>

          <div className="pagination-controls">
            <button
              type="button"
              onClick={goPrevious}
              disabled={safePage === 1}
              className="page-nav-button"
            >
              Previous
            </button>

            {totalPages > 1 &&
              Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={
                    page === safePage ? "page-number-button active" : "page-number-button"
                  }
                >
                  {page}
                </button>
              ))}

            <button
              type="button"
              onClick={goNext}
              disabled={safePage === totalPages}
              className="page-nav-button"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ReferralsTable;
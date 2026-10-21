import { Link, useSearchParams } from "react-router-dom";
import { ClipboardList, SearchX } from "lucide-react";
import AsyncBoundary from "../components/common/AsyncBoundary";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import useCategories from "../features/categories/hooks/useCategories";
import RequestFilters from "../features/requests/components/RequestFilters";
import RequestList from "../features/requests/components/RequestList";
import useRequests from "../features/requests/hooks/useRequests";
import useAuth from "../hooks/useAuth";
import { PATHS } from "../routes/paths";
import { cx } from "../utils/classNames";

const PER_PAGE = 10;

/** "My requests" for citizens, "All requests" for admins. Filters and page live in the URL. */
export default function RequestsPage() {
  const { citizen } = useAuth();
  const isAdmin = citizen.is_admin;
  const [params, setParams] = useSearchParams();
  const status = params.get("status") || "";
  const categoryId = params.get("category") || "";
  const page = Math.max(1, parseInt(params.get("page"), 10) || 1);

  const { requests, pagination, isLoading, isRefreshing, error, reload } =
    useRequests({
      page,
      perPage: PER_PAGE,
      status,
      categoryId,
    });
  const { categories } = useCategories();

  const writeParams = ({ status: s, category, page: p }, replace) => {
    const next = new URLSearchParams();
    if (s) next.set("status", s);
    if (category) next.set("category", category);
    if (p > 1) next.set("page", String(p));
    setParams(next, { replace });
  };

  // Changing a filter goes back to page 1
  const handleFilterChange = ({ status: s, category }) =>
    writeParams({ status: s, category, page: 1 }, true);

  const handlePageChange = (nextPage) => {
    writeParams({ status, category: categoryId, page: nextPage }, false);
    window.scrollTo({ top: 0 });
  };

  const hasFilters = Boolean(status || categoryId);

  const emptyState = hasFilters ? (
    <EmptyState
      icon={SearchX}
      title="No requests match these filters"
      action={
        <Button
          variant="secondary"
          onClick={() => handleFilterChange({ status: "", category: "" })}
        >
          Clear filters
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={ClipboardList}
      title={isAdmin ? "No requests yet" : "You haven’t made any requests yet"}
      text={
        isAdmin
          ? "New requests from citizens will appear here."
          : "Report a problem and follow it here until it is resolved."
      }
      action={
        !isAdmin && (
          <Button as={Link} to={PATHS.NEW_REQUEST}>
            Request a service
          </Button>
        )
      }
    />
  );

  return (
    <>
      <PageHeader
        title={isAdmin ? "All requests" : "My requests"}
        subtitle={
          isAdmin
            ? "Open a request to update its status."
            : "Open a request to see how it is progressing."
        }
        action={
          !isAdmin && (
            <Button as={Link} to={PATHS.NEW_REQUEST} variant="accent">
              Request a service
            </Button>
          )
        }
      />

      {/* Outside the boundary so the filters keep focus while a new page loads */}
      <RequestFilters
        status={status}
        categoryId={categoryId}
        categories={categories}
        onChange={handleFilterChange}
      />

      <AsyncBoundary isLoading={isLoading} error={error} onRetry={reload}>
        <div
          aria-busy={isRefreshing}
          className={cx("transition-opacity", isRefreshing && "opacity-60")}
        >
          <RequestList
            requests={requests}
            showCitizen={isAdmin}
            emptyState={emptyState}
          />
          <Pagination {...pagination} onPageChange={handlePageChange} />
        </div>
      </AsyncBoundary>
    </>
  );
}

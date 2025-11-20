import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Eye, Trash2, FileDown, Search, Download } from "lucide-react";

import {
  useDeletePaymentMutation,
  useGetPaymentsQuery,
} from "../../features/api/paymentsApi";

import type { RootState } from "../../app/store";
import type { TPaymentSelect, TPaymentStatus } from "../../types/paymentsTypes";

import { SkeletonLoader } from "../../components/payment/skeleton/SkeletonLoader";
import { SearchBar } from "../../components/common/SearchBar";
import {
  exportMultiplePaymentsToPDF,
} from "../../utils/exportPDF";
import { parseRTKError } from "../../utils/parseRTKError";
import { Error } from "../../components/common/Error";

export const AdminPayment = () => {
  const navigate = useNavigate();
  const { userType, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [query, setQuery] = useState("");
  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && userType !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, userType, navigate]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPaymentsQuery();

  console.log(data)

  const payments = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const totalCompletedAmount = useMemo(() => {
    return (
      payments
        .filter((p) => p.paymentStatus === "Completed")
        .reduce((sum, p) => sum + parseFloat(p.amount), 0)
    );
  }, [payments]);
  
  const totalPendingAmount = useMemo(() => {
    return (
      payments
        .filter((p) => p.paymentStatus === "Pending")
        .reduce((sum, p) => sum + parseFloat(p.amount), 0)
    );
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const q = query.toLowerCase();
    return payments.filter(
      (p: { transactionId: string; paymentMethod: string; paymentStatus: string; booking: { bookingId: { toString: () => string | string[]; }; }; }) =>
        p.transactionId?.toLowerCase().includes(q) ||
        p.paymentMethod?.toLowerCase().includes(q) ||
        p.paymentStatus?.toLowerCase().includes(q) ||
        p.booking.bookingId.toString().includes(q)
    );
  }, [query, payments]);

  const handleViewDetails = (payment: TPaymentSelect) => {
    navigate(`/admin/payment/receipt/${payment.paymentId}`);
  };

  const handleDelete = async (paymentId: number) => {
    const confirm = await Swal.fire({
      title: "Delete Payment?",
      text: "This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deletePayment(paymentId).unwrap();
      toast.success("Payment deleted successfully.");
      refetch();
    } catch (err) {
      const errorMsg = parseRTKError(err);
      toast.error(errorMsg);
    }
  };

  const handleExportAll = async () => {
    if (filteredPayments.length === 0) {
      toast.error("No payments to export.");
      return;
    }

    const confirm = await Swal.fire({
      title: "Export All Payments?",
      text: `This will download ${filteredPayments.length} payment(s) as a PDF file.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, export",
    });

    if (!confirm.isConfirmed) return;

    exportMultiplePaymentsToPDF(filteredPayments);
    toast.success("PDF export started.");
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10 text-red-500">
        You must be logged in to view this page.
      </div>
    );
  }

  if (isLoading) return <SkeletonLoader count={5} />;
  if (isError)
    return <Error message={parseRTKError(error)} showRetry onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Payment History
                  </h1>
                  <p className="text-slate-600">
                    Manage and track your payment transactions
                  </p>
                </div>
    
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                  {/* Search Bar */}
                  <div className="relative min-w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <SearchBar
                      placeholder="Search by transaction ID, method, status..."
                      onSearch={setQuery}
                      isLoading={isLoading}
                    />
                  </div>
    
                  {/* Export Button */}
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    onClick={handleExportAll}
                    disabled={filteredPayments.length === 0}
                  >
                    <Download className="w-4 h-4" />
                    Export All ({filteredPayments.length})
                  </button>
                </div>
              </div>
            </div>
    
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">
                      Total Payments
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {payments.length}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileDown className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
    
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      $
                      {totalCompletedAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
    
                  <div className="bg-green-100 p-3 rounded-lg">
                    <div className="w-6 h-6 text-green-600 font-bold">$</div>
                  </div>
                </div>
              </div>
              {/* Pending Amount */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">
                      Pending Amount
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      $
                      {totalPendingAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <div className="w-6 h-6 text-yellow-600 font-bold">$</div>
                  </div>
                </div>
              </div>
    
              {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">
                      Filtered Results
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {filteredPayments.length}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Filter className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div> */}
            </div>
    
            {/* Payment Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No payments found
                  </h3>
                  <p className="text-slate-600">
                    {query
                      ? "Try adjusting your search criteria"
                      : "No payments available to display"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">
                          Transaction Details
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">
                          Amount
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">
                          Date & Time
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">
                          Payment Method
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">
                          Status
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-slate-700 text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredPayments.map((payment) => (
                        <tr
                          key={payment.paymentId}
                          className="hover:bg-slate-50 transition-colors duration-200"
                        >
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-mono text-sm font-medium text-slate-900 truncate max-w-40">
                                {payment.transactionId ?? "N/A"}
                              </span>
                              <span className="text-xs text-slate-500">
                                Booking #{payment.booking.bookingId}
                              </span>
                            </div>
                          </td>
    
                          <td className="py-4 px-6">
                            <span className="text-lg font-bold text-green-600">
                              ${payment.amount.toLocaleString()}
                            </span>
                          </td>
    
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-900">
                                {new Date(payment.paymentDate).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(payment.paymentDate).toLocaleTimeString()}
                              </span>
                            </div>
                          </td>
    
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border">
                              {payment.paymentMethod}
                            </span>
                          </td>
    
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                payment.paymentStatus ===
                                ("Confirmed" as TPaymentStatus)
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : payment.paymentStatus === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  payment.paymentStatus ===
                                  ("Confirmed" as TPaymentStatus)
                                    ? "bg-green-500"
                                    : payment.paymentStatus === "Pending"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                              />
                              {payment.paymentStatus}
                            </span>
                          </td>
    
                          <td className="py-4 px-6">
                            <div className="flex justify-center gap-2">
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleViewDetails(payment)}
                                disabled={isDeleting}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleDelete(payment.paymentId)}
                                disabled={isDeleting}
                                title="Delete Payment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
    
            {/* Footer */}
            {filteredPayments.length > 0 && (
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
                  <div>
                    Showing {filteredPayments.length} of {payments.length} payments
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Last updated: {new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
  );
};

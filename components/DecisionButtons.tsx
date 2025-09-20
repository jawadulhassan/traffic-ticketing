"use client";

import { CheckCircle, XCircle } from "lucide-react";

interface DecisionButtonsProps {
  onAccept: () => void;
  onReject: () => void;
  isRejectMode: boolean;
  selectedIssue: string;
  isLoading: boolean;
}

export default function DecisionButtons({
  onAccept,
  onReject,
  isRejectMode,
  selectedIssue,
  isLoading,
}: DecisionButtonsProps) {
  if (isRejectMode) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Confirm Rejection
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          You are about to reject this event. Please ensure you have selected
          the appropriate issue reason above.
        </p>

        <div className="flex space-x-4">
          <button
            onClick={onReject}
            disabled={!selectedIssue || isLoading}
            className="flex-1 btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <XCircle className="h-5 w-5 mr-2" />
                Confirm Reject
              </div>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Event Decision
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Review the video and DMV information, then make your decision:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onAccept}
          disabled={isLoading}
          className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="spinner mr-2"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Accept Event
            </div>
          )}
        </button>

        <button
          onClick={onReject}
          disabled={isLoading}
          className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="spinner mr-2"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <XCircle className="h-5 w-5 mr-2" />
              Reject Event
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

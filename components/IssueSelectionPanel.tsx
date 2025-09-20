"use client";

import { AlertTriangle, Camera, CreditCard, Database } from "lucide-react";

interface IssueSelectionPanelProps {
  selectedIssue: string;
  onIssueChange: (issue: string) => void;
  isRejectMode: boolean;
}

const issueOptions = [
  {
    id: "false_positive",
    label: "False Positive Event",
    description: "No violation occurred - event should be dismissed",
    icon: AlertTriangle,
    color: "text-orange-600",
  },
  {
    id: "main_camera_issue",
    label: "Main Camera Issue",
    description: "Video quality is poor or camera malfunction",
    icon: Camera,
    color: "text-red-600",
  },
  {
    id: "license_plate_issue",
    label: "License Plate Issue",
    description: "License plate is unclear or unreadable",
    icon: CreditCard,
    color: "text-yellow-600",
  },
  {
    id: "dmv_information_issue",
    label: "DMV Information Issue",
    description: "DMV data does not match the vehicle in video",
    icon: Database,
    color: "text-purple-600",
  },
];

export default function IssueSelectionPanel({
  selectedIssue,
  onIssueChange,
  isRejectMode,
}: IssueSelectionPanelProps) {
  if (!isRejectMode) {
    return null;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Issue Reason
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Please select the primary reason for rejecting this event:
      </p>

      <div className="space-y-3">
        {issueOptions.map((issue) => {
          const Icon = issue.icon;
          const isSelected = selectedIssue === issue.id;

          return (
            <label
              key={issue.id}
              className={`block cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="issue"
                value={issue.id}
                checked={isSelected}
                onChange={(e) => onIssueChange(e.target.value)}
                className="sr-only"
              />

              <div className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 ${
                    isSelected ? issue.color : "text-gray-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-medium ${
                        isSelected ? "text-primary-900" : "text-gray-900"
                      }`}
                    >
                      {issue.label}
                    </h4>

                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      </div>
                    )}
                  </div>

                  <p
                    className={`text-xs mt-1 ${
                      isSelected ? "text-primary-700" : "text-gray-500"
                    }`}
                  >
                    {issue.description}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

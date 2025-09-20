"use client";

import { useState } from "react";
import { Search, AlertCircle } from "lucide-react";

interface LicensePlateInputProps {
  licensePlateNumber: string;
  onLicensePlateChange: (value: string) => void;
  onDmvLookup: () => void;
  isLoading: boolean;
  error?: string;
}

export default function LicensePlateInput({
  licensePlateNumber,
  onLicensePlateChange,
  onDmvLookup,
  isLoading,
  error,
}: LicensePlateInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="licensePlate"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          License Plate Number
        </label>
        <div className="flex space-x-2">
          <input
            id="licensePlate"
            type="text"
            value={licensePlateNumber}
            onChange={(e) => onLicensePlateChange(e.target.value.toUpperCase())}
            placeholder="Enter license plate number"
            className="flex-1 input"
            maxLength={8}
          />
          <button
            type="button"
            onClick={onDmvLookup}
            disabled={!licensePlateNumber.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="spinner mr-2"></div>
                Loading...
              </div>
            ) : (
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                DMV Lookup
              </div>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-danger-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-xs text-gray-500">
        Enter the license plate number as it appears in the image above. Use DMV
        Lookup to verify vehicle details.
      </div>
    </div>
  );
}

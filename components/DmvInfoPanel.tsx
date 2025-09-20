"use client";

import { Car, User, MapPin, Calendar } from "lucide-react";

interface DmvInfo {
  license_plate: string;
  make: string;
  model: string;
  color: string;
  registration_date: string;
  expiration_date: string;
  owner_name: string;
  address: string;
}

interface DmvInfoPanelProps {
  dmvInfo: DmvInfo | null;
  isLoading: boolean;
}

export default function DmvInfoPanel({
  dmvInfo,
  isLoading,
}: DmvInfoPanelProps) {
  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Car className="h-5 w-5 mr-2 text-primary-600" />
          DMV Information
        </h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!dmvInfo) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Car className="h-5 w-5 mr-2 text-primary-600" />
          DMV Information
        </h3>
        <div className="text-center py-8 text-gray-500">
          <Car className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No DMV data available</p>
          <p className="text-sm">
            Use the DMV Lookup button to fetch vehicle information
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Car className="h-5 w-5 mr-2 text-primary-600" />
        DMV Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
            Vehicle Details
          </h4>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                License Plate
              </label>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                {dmvInfo.license_plate}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Make & Model
              </label>
              <p className="text-sm text-gray-900">
                {dmvInfo.make} {dmvInfo.model}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Color
              </label>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: dmvInfo.color.toLowerCase() }}
                />
                <span className="text-sm text-gray-900 capitalize">
                  {dmvInfo.color}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
            Registration
          </h4>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Registration Date
              </label>
              <p className="text-sm text-gray-900">
                {dmvInfo.registration_date}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Expiration Date
              </label>
              <p className="text-sm text-gray-900">{dmvInfo.expiration_date}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                <User className="h-3 w-3 mr-1" />
                Owner
              </label>
              <p className="text-sm text-gray-900">{dmvInfo.owner_name}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                Address
              </label>
              <p className="text-sm text-gray-900">{dmvInfo.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

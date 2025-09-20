"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCw, AlertCircle } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import LicensePlateInput from "@/components/LicensePlateInput";
import DmvInfoPanel from "@/components/DmvInfoPanel";
import IssueSelectionPanel from "@/components/IssueSelectionPanel";
import DecisionButtons from "@/components/DecisionButtons";

interface TrafficEvent {
  id: number;
  video_url: string;
  license_plate_image_url: string;
  event_type: string;
  location: string;
  timestamp: string;
}

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

interface User {
  id: number;
  email: string;
  name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentEvent, setCurrentEvent] = useState<TrafficEvent | null>(null);
  const [licensePlateNumber, setLicensePlateNumber] = useState("");
  const [dmvInfo, setDmvInfo] = useState<DmvInfo | null>(null);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dmvLoading, setDmvLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));

    // Initialize database if needed
    fetch("/api/init-db", { method: "POST" }).then(() => {
      fetchNextEvent();
    });
  }, [router]);

  const fetchNextEvent = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/events");
      const data = await response.json();

      if (response.ok) {
        setCurrentEvent(data.event);
        // Reset form state
        setLicensePlateNumber("");
        setDmvInfo(null);
        setSelectedIssue("");
        setIsRejectMode(false);
      } else {
        setError(data.message || "Failed to fetch event");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDmvLookup = async () => {
    if (!licensePlateNumber.trim()) return;

    setDmvLoading(true);
    setError("");

    try {
      const response = await fetch("/api/dmv-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ licensePlate: licensePlateNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setDmvInfo(data);
      } else {
        setError(data.error || "DMV lookup failed");
      }
    } catch (err) {
      setError("Network error during DMV lookup");
    } finally {
      setDmvLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!currentEvent || !user) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/annotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: currentEvent.id,
          userId: user.id,
          licensePlateNumber,
          decision: "accepted",
          dmvInfo,
        }),
      });

      if (response.ok) {
        await fetchNextEvent();
      } else {
        setError("Failed to submit annotation");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!currentEvent || !user || !selectedIssue) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/annotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: currentEvent.id,
          userId: user.id,
          licensePlateNumber,
          decision: "rejected",
          issueReason: selectedIssue,
          dmvInfo,
        }),
      });

      if (response.ok) {
        await fetchNextEvent();
      } else {
        setError("Failed to submit annotation");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Traffic Ticketing Annotation Tool
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {isLoading && !currentEvent ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading next event...</p>
            </div>
          </div>
        ) : !currentEvent ? (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No More Events
            </h2>
            <p className="text-gray-600 mb-4">
              All events have been processed.
            </p>
            <button onClick={fetchNextEvent} className="btn-primary">
              Check for New Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Video and License Plate */}
            <div className="space-y-6">
              {/* Event Info */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Event #{currentEvent.id}
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Type:</strong>{" "}
                    {currentEvent.event_type.replace("_", " ").toUpperCase()}
                  </p>
                  <p>
                    <strong>Location:</strong> {currentEvent.location}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(currentEvent.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Video Player */}
              <VideoPlayer videoUrl={currentEvent.video_url} />

              {/* License Plate Image */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  License Plate Image
                </h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <img
                    src={currentEvent.license_plate_image_url}
                    alt="License plate"
                    className="w-full h-32 object-contain rounded border"
                  />
                </div>
              </div>

              {/* License Plate Input */}
              <LicensePlateInput
                licensePlateNumber={licensePlateNumber}
                onLicensePlateChange={setLicensePlateNumber}
                onDmvLookup={handleDmvLookup}
                isLoading={dmvLoading}
                error={error}
              />
            </div>

            {/* Right Column - DMV Info and Decisions */}
            <div className="space-y-6">
              {/* DMV Information */}
              <DmvInfoPanel dmvInfo={dmvInfo} isLoading={dmvLoading} />

              {/* Issue Selection */}
              <IssueSelectionPanel
                selectedIssue={selectedIssue}
                onIssueChange={setSelectedIssue}
                isRejectMode={isRejectMode}
              />

              {/* Decision Buttons */}
              <DecisionButtons
                onAccept={handleAccept}
                onReject={() => {
                  if (isRejectMode) {
                    handleReject();
                  } else {
                    setIsRejectMode(true);
                  }
                }}
                isRejectMode={isRejectMode}
                selectedIssue={selectedIssue}
                isLoading={isLoading}
              />

              {/* Back Button (when in reject mode) */}
              {isRejectMode && (
                <div className="card">
                  <button
                    onClick={() => setIsRejectMode(false)}
                    className="w-full btn-secondary"
                  >
                    Back to Decision
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

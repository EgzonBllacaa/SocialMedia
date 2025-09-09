import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Backend } from "../../utils/BackendRoute";
import type { Information } from "../../types/types";

const Profile = () => {
  const [data, setData] = useState<Information | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [education, setEducation] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const { currentUser } = useAuth();

  // Fetch user profile data
  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    const getUserProfile = async () => {
      try {
        const res = await fetch(`${Backend}/api/profile`, {
          method: "GET",
          credentials: "include",
        });
        const userData = await res.json();
        if (res.ok) {
          setData(userData);
          if (!sessionStorage.getItem("profileReloaded")) {
            sessionStorage.setItem("profileReloaded", "true");
            window.location.reload();
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Failed to load profile: ${err.message}`);
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [currentUser]);

  // Open edit mode and populate form
  const handleEdit = () => {
    setFirstName(data?.firstName || "");
    setLastName(data?.lastName || "");
    setLocation(data?.location || "");
    setEducation(data?.education || "");
    setBirthDate(data?.birthDate ? new Date(data.birthDate) : null);
    setSkills(data?.skills?.map((s) => s.name).join(", ") || "");
    setEditMode(true);
  };

  // Cancel edit mode
  const handleCancel = () => {
    setEditMode(false);
  };

  // Submit form (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = data?.firstName ? "PUT" : "POST";
      const res = await fetch(`${Backend}/api/profile/information`, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          location,
          birthDate: birthDate ? birthDate.toISOString() : null,
          education,
          skills,
        }),
      });
      const updatedData = await res.json();
      setData(updatedData);
      setEditMode(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to save profile: ${err.message}`);
      } else {
        setError("Failed to save profile");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen py-10 flex flex-col gap-20">
      <h1 className="text-6xl">
        Hello {data?.firstName?.trim() || currentUser?.email || "Guest"}
      </h1>

      {/* Display profile info */}
      {!editMode && data && (
        <div className="bg-slate-800 py-4 px-10 rounded-lg">
          <div className="flex justify-between border-b border-slate-600 pb-2 items-center">
            <h6 className="text-slate-200 text-2xl font-medium">
              Personal Information
            </h6>
            <button
              onClick={handleEdit}
              className="hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="bg-slate-800 flex flex-col gap-6 w-full py-5">
            <div className="w-full flex flex-col gap-4">
              <div className="flex">
                <div className="flex flex-col w-full max-w-1/3">
                  <span className="text-zinc-400">First Name</span>
                  <span className="font-semibold">
                    {data.firstName || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col w-full max-w-1/3">
                  <span className="text-zinc-400">Last Name</span>
                  <span className="font-semibold">
                    {data.lastName || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col w-full max-w-1/3">
                  <span className="text-zinc-400">Location</span>
                  <span className="font-semibold">
                    {data.location || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex">
                <div className="flex flex-col w-full max-w-1/3">
                  <span className="text-zinc-400">Education</span>
                  <span className="font-semibold">
                    {data.education || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col w-full max-w-xl">
                  <span className="text-zinc-400">Skills</span>
                  <div className="flex flex-wrap gap-2">
                    {data.skills?.map((s) => (
                      <span
                        key={s.id}
                        className="border font-semibold mr-2 border-slate-500 rounded px-4 border-t-0 border-r-0"
                      >
                        {s.name}
                      </span>
                    )) || "N/A"}
                  </div>
                </div>
                <div className="flex flex-col w-full max-w-2xl">
                  <span className="text-zinc-400">Date of Birth</span>
                  <span className="font-semibold">
                    {data.birthDate
                      ? new Date(data.birthDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit form */}
      {editMode && (
        <div className="w-full max-w-[1600px] px-10 mx-auto bg-[hsl(230,42%,10%)] py-10">
          <h3 className="text-3xl mb-8 border-b w-full pb-2">
            Edit Personal Information
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="sm:flex-row flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1 sm:w-1/2">
                <label>First Name:</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border border-slate-400 w-full rounded p-2"
                />
              </div>
              <div className="flex flex-col gap-1 sm:w-1/2">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border border-slate-400 w-full rounded p-2"
                />
              </div>
            </div>
            <div className="sm:flex-row flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1 sm:w-1/2">
                <label>Location:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border border-slate-400 w-full rounded p-2"
                />
              </div>
              <div className="flex flex-col gap-1 sm:w-1/2">
                <label>Birthdate:</label>
                <input
                  type="date"
                  value={birthDate ? birthDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setBirthDate(new Date(e.target.value))}
                  className="border border-slate-400 w-full rounded p-2"
                />
              </div>
            </div>
            <div className="sm:flex-row flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1 sm:w-1/2">
                <label>Education:</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="border border-slate-400 w-full rounded p-2"
                />
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <label>Skills:</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="border border-slate-400 w-full rounded p-2"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-500 text-white font-medium p-4 rounded-xl hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-slate-200 text-black font-medium p-4 rounded-xl hover:bg-slate-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;

"use client";

import { useEffect, useState } from "react";

interface GalleryMember {
  memberId: number;
  firstName: string;
  lastName: string;
  thoughts: string | null;
}

export default function GalleryPage() {
  const [members, setMembers] = useState<GalleryMember[]>([]);

  useEffect(() => {
    fetch("/api/gallery").then((r) => r.json()).then(setMembers);
  }, []);

  return (
    <div>
      <h1 className="font-display text-[26px] font-semibold mb-4">Photo Gallery</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {members.map((m) => (
          <div key={m.memberId} className="bg-white border border-line rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/members/${m.memberId}/photo`}
              alt={m.firstName}
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <div className="font-medium text-sm">{m.firstName} {m.lastName}</div>
              {m.thoughts && <div className="text-xs text-gray-500 italic mt-1">"{m.thoughts}"</div>}
            </div>
          </div>
        ))}
        {members.length === 0 && <div className="text-sm text-gray-500">No photos uploaded yet.</div>}
      </div>
    </div>
  );
}

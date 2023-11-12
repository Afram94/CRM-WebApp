import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { PageProps } from '@/types';

const CustomerProfiles: React.FC<PageProps> = ({ auth }) => {
  console.log(auth.customer_profile);
  return (
    <MainLayout>
      <div className="flex flex-wrap justify-around">
        {auth.customer_profile.map((profile) => (
          <div key={profile.id} className="m-4 p-5 rounded-lg shadow-lg border border-gray-300">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              {profile.name}
            </h3>
            <p className="text-base mb-3 text-gray-800">Email: {profile.email}</p>
            <p className="text-base mb-3 text-gray-800">Phone: {profile.phone_number}</p>
            {/* Render notes for the profile */}
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2 text-gray-700">Notes:</h4>
              {profile.notes && profile.notes.length > 0 ? (
                profile.notes.map((note) => (
                  <div key={note.id} className="mb-2">
                    <p className="text-sm font-semibold text-gray-800">{note.title}</p>
                    <p className="text-sm text-gray-600">{note.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No notes available</p>
              )}
            </div>
            {/* End of notes section */}
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default CustomerProfiles;

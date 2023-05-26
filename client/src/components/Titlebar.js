import React, { useState } from 'react';

export default function TitleBar() {
  const [refresh] = useState(false)

  function setRefresh(value) {
    window.location.reload(value);
  }

    return (
      <div class="flex flex-row m-6 shadow-md sm:rounded-lg">
        <div class="w-1/3 p-6">
          <img src="https://tspace.library.utoronto.ca/retrieve/d2a89b4a-bf56-46f9-b5b2-5e9b81f6ca8b"/>
        </div>
        <div class="w-2/3 p-6 m-6">
          <h1 class="text-4xl text-uoft-color">Practicum Demands Measure: Occupational Therapy(OT)</h1>
        </div>
        <div class="p-6">
          <button class="bg-uoft-color hover:bg-uoft-color-100 text-white font-bold py-2 px-4 rounded cursor-grab" onClick={() => setRefresh(!refresh)}>Refresh</button>
        </div>
      </div>
)}

import React from "react";

const FeatureItem = ({ icon, title, description }) => {
  return (
    <div className="relative pl-9">
      <dt className="inline font-semibold text-white">
        {icon}
        {title}
      </dt>
      <dd className="inline">{description}</dd>
    </div>
  );
};

export default FeatureItem;

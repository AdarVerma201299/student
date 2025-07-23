import { getImageUrl } from "../../utils/helpers";
import { Envelope, Telephone, GeoAlt } from "react-bootstrap-icons";

export const DetailRow = ({ label, value, children }) => (
  <div className="flex justify-between py-1">
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {label}:
    </span>
    <span className="text-sm text-gray-900 dark:text-gray-200">
      {children || value || "N/A"}
    </span>
  </div>
);

export const ContactSection = ({ email, phone }) => (
  <div className="mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
    <h3 className="section-title">Contact</h3>
    <div className="space-y-2">
      {email && (
        <div className="flex items-center px-3 py-2">
          <Envelope className="icon-sm dark:text-gray-300" />
          <span className="ml-2 text-sm dark:text-gray-300">{email}</span>
        </div>
      )}
      {phone && (
        <div className="flex items-center px-3 py-2">
          <Telephone className="icon-sm dark:text-gray-300" />
          <span className="ml-2 text-sm dark:text-gray-300">{phone}</span>
        </div>
      )}
    </div>
  </div>
);

export const PageHeader = ({ title, subtitle }) => (
  <div className="mb-8 text-center">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      {title}
    </h1>
    {subtitle && (
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
        {subtitle}
      </p>
    )}
  </div>
);

export const ProfileCard = ({
  image,
  name,
  role,
  children,
  isActive,
  onViewAadhar,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
    <div className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <img
          src={image || "/default-avatar.png"}
          alt="Profile"
          className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
        />
      </div>

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
        {name}
      </h2>
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
          isActive
            ? "text-green-800 bg-green-100 dark:text-green-100 dark:bg-green-800"
            : "text-red-800 bg-red-100 dark:text-red-100 dark:bg-red-800"
        }`}
      >
        {role}
      </div>

      <div className="space-y-3 text-left">{children}</div>

      {onViewAadhar && (
        <button
          onClick={onViewAadhar}
          className="btn-primary w-full mt-4 flex items-center justify-center"
        >
          View Aadhaar Card
        </button>
      )}
    </div>
  </div>
);

const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full transition-colors duration-200">
      <div className="flex justify-between items-center border-b p-4 border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {children}
    </div>
  </div>
);

export const ProfileDetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <span className="icon-sm">{icon}</span>
    <span className="ml-2 dark:text-gray-300">
      <span className="font-medium">{label}:</span> {value || "N/A"}
    </span>
  </div>
);

export const AddressSection = ({
  residentialAddress,
  permanentAddress,
  activeAddress,
  onToggleAddress,
}) => (
  <div className="mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
    <h3 className="section-title">Address</h3>
    <div className="space-y-2">
      <AddressToggle
        type="residential"
        address={residentialAddress}
        active={activeAddress === "residential"}
        onClick={() => onToggleAddress("residential")}
      />
      <AddressToggle
        type="permanent"
        address={permanentAddress}
        active={activeAddress === "permanent"}
        onClick={() => onToggleAddress("permanent")}
      />
    </div>
  </div>
);

const AddressToggle = ({ type, address, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
      active
        ? "bg-gray-100 dark:bg-gray-700"
        : "hover:bg-gray-50 dark:hover:bg-gray-700"
    }`}
  >
    <div className="flex items-center">
      <GeoAlt className="icon-sm dark:text-gray-300" />
      <span className="ml-2 font-medium capitalize dark:text-gray-300">
        {type}
      </span>
    </div>
    {active && address && (
      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 pl-6">
        {address.village}, {address.post},<br />
        {address.district}, {address.state},<br />
        {address.country}
      </div>
    )}
  </button>
);

export const AadharModal = ({ isOpen, onClose, frontImage, backImage }) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} title="Aadhaar Card Details">
      <div className="flex flex-col md:flex-row gap-6 justify-center p-6">
        <ImageWithLabel
          image={frontImage}
          label="Front Side"
          alt="Front of Aadhaar card"
        />
        <ImageWithLabel
          image={backImage}
          label="Back Side"
          alt="Back of Aadhaar card"
        />
      </div>
    </Modal>
  );
};

const ImageWithLabel = ({ image, label, alt }) => (
  <div className="flex-1">
    <h4 className="image-label dark:text-gray-300">{label}</h4>
    <img
      src={getImageUrl(image)}
      alt={alt}
      className="w-full h-auto rounded-lg shadow-md border dark:border-gray-600"
    />
  </div>
);

export const DetailCard = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {children}
    </div>
  </div>
);

/**
 * Removes user data from localStorage
 * @param {string|number} key - Key/index of user in storage
 * @param {string} [storageKey='UserData'] - localStorage key to modify
 */
export const DeleteUserInLocalStorage = (key, storageKey = "UserData") => {
  try {
    const currentData = JSON.parse(localStorage.getItem(storageKey));

    if (Array.isArray(currentData)) {
      // Remove by index
      const updatedData = currentData.filter((_, index) => index !== key);
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
    } else if (typeof currentData === "object" && currentData !== null) {
      // Remove by key
      const { [key]: _, ...remainingData } = currentData;
      localStorage.setItem(storageKey, JSON.stringify(remainingData));
    }

    return true;
  } catch (error) {
    console.error("Failed to delete user from localStorage:", error);
    return false;
  }
};

/**
 * Clears all user-related data from localStorage
 * @param {string} userId - ID of user to clear
 */
export const clearAllUserData = (userId) => {
  const itemsToRemove = [
    "User",
    "UserData",
    `FeeShiftData${userId}`,
    `PaymentRecords${userId}`,
  ];

  itemsToRemove.forEach((item) => localStorage.removeItem(item));
};

module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
 
  isCurrentUserOwner:(commentOwnerId, currentUserId)=> {
    return commentOwnerId === currentUserId;
  }
};

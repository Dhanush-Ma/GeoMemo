export default function closeAllOpeningModals(
  alertMessageModal,
  addToFavModal,
  viewFavModal,
) {
  addToFavModal?.handleAddToFavModal(addToFavModal.addToFavModalRef, 'close');
  alertMessageModal?.handleAlertMessageModal(
    alertMessageModal.alertMessageModalRef,
    'close',
  );
  viewFavModal?.handleViewFavModal(viewFavModal.viewFavModalRef, 'close');

  console.log('gere');
}

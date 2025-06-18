import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeletePopup = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this student?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>No</Button>
        <Button variant="danger" onClick={handleConfirm}>Yes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePopup;

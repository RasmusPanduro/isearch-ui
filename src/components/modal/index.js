import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

class TagModal extends Component {
  render () {
    return (
      <Modal show={this.props.showModal} onHide={this.props.close} dialogClassName='modal-xl'>
        <Modal.Body>
          <h4>TAGS WILL BE SHOWN HERE</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

TagModal.propTypes = {
  showModal: PropTypes.func,
  close: PropTypes.func
};

export default TagModal;

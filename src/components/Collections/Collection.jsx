import { useState } from "react";
import ThreeDotsNav from "@assets/three-dots-nav.svg";
import deleteIcon from "@assets/delete.svg";
import editIcon from "@assets/edit.svg";
import Options from "../../ui/Options";
import {
  deleteCollectionRequest,
  editCollectionRequest,
  refreshAccessTokenRequest,
} from "../../services/api";
import { useToast, useAuth } from "../utils/hooks";
import { isTokenExpired } from "../utils/tokens";
import PropTypes from "prop-types";
import EditCollectionModal from "../Modals/EditCollectionModal";
import DeleteCollectionModal from "../Modals/DeleteCollectionModal";

const Collection = ({ collection, onClick, setActiveCollection }) => {
  const operations = {
    NONE: "",
    EDIT_COLLECTION: "editCollection",
    DELETE_COLLECTION: "deleteCollection",
  };

  const showToast = useToast();
  const auth = useAuth();

  let accessToken = localStorage.getItem("access_token");

  if (isTokenExpired(localStorage.getItem("access_token"))) {
    refreshAccessTokenRequest({
      refresh_token: localStorage.getItem("refresh_token"),
    }).then((res) => auth.login(res["tokens"]));
    accessToken = localStorage.getItem("access_token");
  }

  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);

  const [operation, setOperation] = useState(operations.NONE);

  const handleEditCollection = (collectionData) => {
    editCollectionRequest(accessToken, collectionData)
      .then((res) => showToast.success(res["message"]))
      .catch((rej) => showToast.error(rej["message"]));
  };

  const setup = () => {
    setShowModal(true);
    setActiveCollection(collection.collection_name);
  };

  const handleDeleteCollection = () => {
    deleteCollectionRequest(accessToken, {
      collection_name: collection.collection_name,
    })
      .then((res) => showToast.success(res["message"]))
      .catch((rej) => showToast.error(rej["message"]));
  };

  const deleteCollectionProps = {
    showModal: showModal,
    setShowModal: setShowModal,
    handleDeleteCollection: handleDeleteCollection,
  };

  const setEditCollection = () => {
    setEdit(true);
    setOperation(operations.EDIT_COLLECTION);
    setup();
  };

  const setDeleteCollection = () => {
    setOperation(operations.DELETE_COLLECTION);
    setup();
  };

  const optionProps = {
    options: [
      {
        optionName: "Edit",
        onClick: setEditCollection,
        icon: editIcon,
      },
      {
        optionName: "Delete",
        onClick: setDeleteCollection,
        icon: deleteIcon,
      },
    ],
  };

  const [openOptions, setOpenOptions] = useState(false);

  const handleCollectionClick = () => {
    onClick(collection);
  };

  const collectionColor = {
    backgroundColor: collection.color_code,
    width: " 2rem",
    height: "2rem",
    borderRadius: "50%",
  };

  const editCollectionModalProps = {
    edit: edit,
    setEdit: setEdit,
    showModal: showModal,
    setShowModal: setShowModal,
    activeCollection: collection.collection_name,
    setActiveCollection: setActiveCollection,
    handleEditCollection: handleEditCollection,
  };

  return (
    <>
      {operation === operations.EDIT_COLLECTION ? (
        <EditCollectionModal props={editCollectionModalProps} />
      ) : operation === operations.DELETE_COLLECTION ? (
        <DeleteCollectionModal {...deleteCollectionProps} />
      ) : null}
      <div className="collection-card" onClick={handleCollectionClick}>
        <div>
          <div style={collectionColor}></div>
          <img
            onClick={(e) => {
              e.stopPropagation();
              setOpenOptions(!openOptions);
            }}
            src={ThreeDotsNav}
          />
        </div>
        <div>
          <h3>{collection.collection_name}</h3>
          <small>{collection.created_at}</small>
        </div>
        {openOptions && <Options props={optionProps} />}
      </div>
    </>
  );
};

Collection.propTypes = {
  onClick: PropTypes.func,
  collection: PropTypes.object,
  setIsCollectionEdit: PropTypes.func,
  setCollectionFormActive: PropTypes.func,
  setActiveCollection: PropTypes.func,
};

export default Collection;

import React from "react";

import { useState } from "react";

const NewArtifact = (props) => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();

  const submitHandler = async(e) => {
    e.preventDefault();

    if (!image || !name || !description || !price) {
      alert("Please fill up the form");
      return;
    }
    await props.addArtifact(image, name, description, price);

    setImage("");
    setName("");
    setDescription("");
    setPrice("");
  };

  return (
    <form className="zk container" onSubmit={submitHandler}>
      <h3>Add New Artifact</h3>
      <div className="form-row">
        <input
          type="text"
          className="form-control"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image"
        />

        <input
          type="text"
          className="form-control mt-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name Of Artifact"
        />

        <input
          type="text"
          className="form-control mt-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description Of Artifact"
        />

        <input
          type="text"
          className="form-control mt-4"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="price"
        />

        <button type="submit" className="btn btn-outline-dark lk mt-4 mb-4">
          Add Artifact
        </button>
      </div>
    </form>
  );
};
export default NewArtifact;

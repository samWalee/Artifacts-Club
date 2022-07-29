import React from "react";
import { useState } from "react";

const Artifacts = (props) => {
  const [newImage, changeImage] = useState("");
  return (
    <div className="container-fluid d-flex justify-content-center">
      <div className="row">
        {props.artifacts.map((art) => (
          <div className="col-md-3 mt-3" key={art.index}>
            <div className="card text-center  h-100">
              <div className="overflow">
                <img src={art.image} alt="img" width="100%" />
              </div>
              <div className="card-body text-dark">
                <h4 className="card-name">{art.name}</h4>
                <p className="card-text text-seconadry">{art.description}</p>
                <h4 className="price">
                  price is {art.price / 1000000000000000000}cUSD
                </h4>

                {art.owner === props.onlyOwner ? (
                  <>
                    <input
                      className="form-control form-control-lg mt-2"
                      onChange={(e) => changeImage(e.target.value)}
                      type="text"
                      placeholder="Add new Venue"
                    ></input>
                    <button
                      className="btn btn-primary mb-2 mt-2"
                      onClick={async () => {
                        await props.ReformArtifactImage(art.index, newImage);
                        changeImage("");
                      }}
                    >
                      Change Venue
                    </button>
                  </>
                ) : (
                  <a
                    href="/#"
                    className="btn btn-outline-success"
                    onClick={() => props.buyArtifact(art.index)}
                  >
                    Buy Artifact
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Artifacts;

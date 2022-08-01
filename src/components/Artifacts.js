
import React from 'react';
import { useState } from 'react';

 
  
 

const Artifacts = (props) => {

  const [newImage, ChangeImage] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();}
 
  return (
    <div className='conatainer-fluid d-flex justify-content-center'> 
    <div className='row'> 
    {props.artifacts.map((art) => (
    <div className='col-md-4' key={art.index}> 
    <div className='card text-center'>
      <div className='overflow'>
        <img src={art.image} alt='img'/>
      </div>
      <div className='card-body text-dark'>
        <h4 className='card-name'>Card Name {art.name}</h4>
        <p className='card-text text-seconadry'>Description {art.description}</p>
        <h4 className='price'>price {art.price / 1000000000000000000}cUSD</h4>
        <a href='/#' className='btn btn-outline-success' onClick={() => props.buyArtifact(art.index)}>Buy Artifact</a>

        <input class="form-control form-control-lg"  onChange={(e) => ChangeImage(e.target.value)} type="text" placeholder="Add new Artifact Image"></input>
               <button class="btn btn-primary mb-2"  onClick={() => props.ReformArtifactImage(art.index, newImage)}>Reform Artifact Image</button>
      </div>
    </div>
    </div>
    ))}
    </div>
    </div>
  )

  }





export default Artifacts;
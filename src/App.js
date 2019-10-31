import React, { useState } from 'react';
import * as ipfsClient from 'ipfs-http-client';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

let infuraIpfs = ipfsClient({
   host: 'ipfs.infura.io',
   port: '5001',
   protocol: 'https'
});
const ipfsEndpoint = 'https://ipfs.infura.io:5001/api/v0';

const bufferFile = content => Buffer.from(JSON.stringify(content));

function App() {
   const [hash, setHash] = useState(null);

   const handleSubmit = e => {};
   const captureFile = async e => {
      e.stopPropagation();
      e.preventDefault();
      await ipfsAdd(e.target.files);
   };

   const ipfsAdd = async content => {
      const file = bufferFile(content);

      try {
         const [result] = await infuraIpfs.add(file);
         console.log(result.hash);
         setHash(result.hash);
      } catch (err) {
         console.error('Error pinning file to IPFS', err);
      }
   };

   const ipfsGet = async hash => {
      const endpoint = `${ipfsEndpoint}/cat?arg=${hash}`;
      try {
         const { data } = await axios.get(endpoint);
         return data;
      } catch (err) {
         console.error('Error getting data from IPFS', err);
      }
   };

   return (
      <div className="App">
         <form id="captureMedia" onSubmit={handleSubmit}>
            <input type="file" onChange={captureFile} />
            <br />
         </form>
      </div>
   );
}

export default App;

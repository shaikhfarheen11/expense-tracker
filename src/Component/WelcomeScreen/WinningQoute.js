import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaGlobe } from 'react-icons/fa';
import { getDatabase, ref, push, set } from 'firebase/database';
import firebaseApp from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import classes from './WinningQoute.module.css';



const WinningQuote = () => {
  const [fullName, setFullName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const Navigate = useNavigate();

  useEffect(() => {
    
    fetchUserData();
  }, []); 

  const fetchUserData = async () => {
    try {
    
        console.log('Before fetch');
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
  
      if (!user) {
     
        return;
      }
  
      const idToken = await user.getIdToken();
  
      const identityToolkitEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyA-iWDwN9qvPkZ_6bXOw88OOJf6Y5asiwY&idToken=${idToken}`;

  
      const identityToolkitResponse = await fetch(identityToolkitEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
      });
  
      if (identityToolkitResponse.ok) {
        const userData = await identityToolkitResponse.json();
        const { users } = userData;
  
        if (users && users.length > 0) {

          const { displayName, photoUrl } = users[0];
          setFullName(displayName || '');
          setProfilePhoto(photoUrl || '');
        } else {
          console.error('No user data found');
        }
      } else {
        console.error('Failed to fetch user data from identity toolkit');
      }
      console.log('After successful fetch');
    } catch (error) {
      console.error('Error occurred while fetching user data:', error);
    }
  };
  
  const handleUpdate = async () => {
    try {
      if (!fullName || !profilePhoto) {
        console.log('Full name and profile photo URL are required.');
        return;
      }

      const db = getDatabase();
      const dbRef = ref(db, 'winningQuotes');

      const data = {
        fullName: fullName,
        profilePhoto: profilePhoto,
      };

      const newRef = push(dbRef);
      const userKey = newRef.key;

      await set(ref(db, `winningQuotes/${userKey}`), data);

      console.log('User details updated in the Realtime Database successfully!');

      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
      console.log('Current user:', user);


      if (!user) {
        return;
      }

      const idToken = await user.getIdToken();

      const identityToolkitEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=
      AIzaSyA-iWDwN9qvPkZ_6bXOw88OOJf6Y5asiwY`;

      const identityToolkitResponse = await fetch(identityToolkitEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: fullName,
          photoUrl: profilePhoto,
          idToken: idToken,
        }),
      });

      if (identityToolkitResponse.ok) {
        console.log('Identity toolkit update successful!');
      } else {
        console.error('Failed to update with identity toolkit');
      }

      setFullName('');
      setProfilePhoto('');
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  const handleNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handlePhotoChange = (event) => {
    setProfilePhoto(event.target.value);
  };
  const handleCancel = () => {
    Navigate('/welcome');
  }

  return (
    <div>
      <p className={classes.winningQuote}>Winners never quit, Quitters never win.</p>
      <div className={classes.halfCompletion}>
        <p>
          <span>Your Profile is 64% completed. A Complete profile has higher chances of landing a job.</span>
          <span className={classes.completeNow}><Link to="/winning-qoute">Complete now</Link></span>
        </p>
      </div>
      <hr />

      <span className={classes.contactDetails}>Contact Details</span>
      <button className={classes.cancel} onClick={handleCancel}>Cancel</button>
      <div className={classes.inputFields}>
        <FaGithub className={classes.gitHubIcon} />
        Full Name:
        <input
          type="text"
          className={classes.fullNameInput}
          style={{ textAlign: 'left' }}
          value={fullName}
          onChange={handleNameChange}
        />
        <FaGlobe className={classes.globeIcon} />
        Profile Photo Url:
        <input
          type="text"
          className={classes.profileURLInput}
          style={{ textAlign: 'left' }}
          value={profilePhoto}
          onChange={handlePhotoChange}
        />
      </div>
      <button className={classes.update} onClick={handleUpdate}>Update</button>
      <hr className={classes.updateLine} />
    </div>
  );
};

export default WinningQuote;
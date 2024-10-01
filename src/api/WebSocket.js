import { useState } from 'react';
import { useEffect } from 'react';


const STAGING = true;
const SOCKET_URL = STAGING
? // Please use Staging BASE_URL Here
"wss://app-dev-apisocket.medminellc.com"
: // Please Use Production BASE_URL Here
"wss://app-dev-apisocket.medminellc.com";


// export const WebSocketCall = (message) => {
//   // const [isRefresh, setIsRefresh] = useState(false);
  
//   //   useEffect(() => {
//       const ws = new WebSocket(SOCKET_URL);
  
//       ws.onopen = () => {
//         // WebSocket connection is open, you can now send messages
//         if (message) {
//           ws.send(message);
//         }
//       };
  
//       ws.onerror = (error) => {
//         // Handle any errors that occur during the WebSocket connection
//         console.error('WebSocket error:', error);
//       };
  


//       const handleClose = () => {
//         // if (!isRefresh && ws.readyState === WebSocket.OPEN) {
//           // const Profile_Details = localStorage.getItem("Profile_Details");
//           // const Details = JSON.parse(Profile_Details);
//           // ws.send(Details?.email);
//           ws.close(); // Close WebSocket connection
//         // }
//       };
    
//       const handleBeforeUnload = (event) => {
//         const Profile_Details = localStorage.getItem("Profile_Details");
//           const Details = JSON.parse(Profile_Details);
//           setTimeout(() => {
//             // const navType = event.persisted ? 'reload' : performance.getEntriesByType('navigation')[0].type;
//             // if (navType !== 'reload') {
//               ws.send(Details?.email);
//           handleClose();
//           // }
//         }, 1000);
//       };
    
//       window.addEventListener('beforeunload', handleBeforeUnload);




//       // const handleClose = (event) => {
//       //   // if (!isNavigatingAway && ws.readyState === WebSocket.OPEN) {
//       //     // if (!isNavigatingAway) {
//       //     event.preventDefault()
//       //     const Profile_Details = localStorage.getItem("Profile_Details");
//       //     const Details = JSON.parse(Profile_Details);
//       //     // console.log("heleoooooooo", Details)
//       //     // ws.send("helooo")
//       //     ws.send(Details?.email)
//       //     ws.close();
//       //     // ws.send(JSON.stringify({email: Details?.email, message: 'The application has been closed by the user.'}));
//       //   // }
//       // };
  
//       // // window.addEventListener('beforeunload', function(event) {
//       // //     isNavigatingAway = true;
//       // //   });
  
//       // window.addEventListener('unload', handleClose);
  
//       // return () => {
//       //   window.removeEventListener('unload', handleClose);
//       //   ws.close();
//       // };
//   //   }, [message]);

// //   return () => {
// //     window.removeEventListener('beforeunload', handleBeforeUnload);
// //     window.removeEventListener('unload', handleUnload);
// //   };
// // }, [isRefresh]);



//   }


export const WebSocketCall = (message) => {
      const ws = new WebSocket(SOCKET_URL);
      
      ws.onopen = () => {
        if (message) {
          ws.send(message);
          setTimeout(() => {
            ws.close();
        }, 1000);
        }
      };
  
      // ws.onerror = (error) => {
      //   console.error('WebSocket error:', error);
      // };
  
  
      // const handleClose = () => {
  
      //     ws.close(); // Close WebSocket connection

      // };
      // const handleBeforeUnload = (event) => {
      //   // setTimeout(() => {
      //   // const navType = event.persisted ? 'reload' : performance.getEntriesByType('navigation')[0].type;
      //   // if (navType) {
      //     const Profile_Details = localStorage.getItem("Profile_Details");
      //     const Details = JSON.parse(Profile_Details);
      //     setTimeout(() => {
      //       ws.send(JSON.stringify({ email: Details?.email, action: 'close' }));
      //       // const navType = event.persisted ? 'reload' : performance.getEntriesByType('navigation')[0].type;
      //       // if (performance.navigation.type === 1) {
      //     handleClose();
      //   // }
      // }, 1000);
      // };
      
      // window.addEventListener('beforeunload', handleBeforeUnload);
    

      let Details;
      try {
          const Profile_Details = localStorage.getItem("Profile_Details");
          if (Profile_Details) {
              Details = JSON.parse(Profile_Details);
          }
      } catch (error) {
          console.error("Error accessing localStorage:", error);
      }

      const sendClosingMessage = () => {
        // console.log("Detail",Details?.email)
        // setTimeout(() => {
          ws.send(Details?.email);
        // }, 500);
      };
  
      window.onbeforeunload = function() {
        // Delay closing the connection to ensure message is sent
          sendClosingMessage();
  
        setTimeout(() => {
          ws.close();
      }, 1000); // 1000 milliseconds delay
  };

  }

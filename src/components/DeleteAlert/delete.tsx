// import {
//   useDisclosure,
//   Button,
//   AlertDialog,
//   AlertDialogOverlay,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogBody,
//   AlertDialogFooter,
// } from "@chakra-ui/react";
// import React from "react";

// function AlertDialogExample() {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const cancelRef = React.useRef();

//   return (
//     <>
//       <Button colorScheme="red" onClick={onOpen}>
//         Delete Customer
//       </Button>

//       <AlertDialog
//         isOpen={isOpen}
//         leastDestructiveRef={cancelRef}
//         onClose={onClose}
//       >
//         <AlertDialogOverlay>
//           <AlertDialogContent>
//             <AlertDialogHeader fontSize="lg" fontWeight="bold">
//               Delete Customer
//             </AlertDialogHeader>

//             <AlertDialogBody>
//               Are you sure? You can&#39t undo this action afterwards.
//             </AlertDialogBody>

//             <AlertDialogFooter>
//               <Button ref={cancelRef} onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button colorScheme="red" onClick={onClose} ml={3}>
//                 Delete
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
//     </>
//   );
// }

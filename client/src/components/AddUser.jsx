import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { addUsers, updateUser } from "../utils/api";
import { useState } from "react";

const AddUser = ({ open, setOpen, userData }) => {
  const defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);
  const [name, setname] = useState("");
  const [title, settitle] = useState("");
  const [role, setrole] = useState("");
  const [email, setemail] = useState("");
  const [admin, setadmin] = useState(false);
  const [tasks, settasks] = useState([]);
  const [isActive, setisActive] = useState(true);


  const isLoading = false, // Adjust this for loading state
    isUpdating = false; // Adjust this for updating state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  addUsers({
  
    
    name: name,
    title: title,
    role: role,
    email: email,
    password: "$2a$10$SzmbjHtJsmkD8QHips9Sdu3peo/E2atwGJuPFZ9A1kriMMWeWeXDS",
    isAdmin: admin,
    tasks: tasks,
    isActive: isActive,
  });

  // Submit handler
  const handleOnSubmit = async (formData) => {
    try {
      console.log("Submitted Data:", formData);
      const updatedData = { ...formData, id: user.id }; // Include user ID
      const response = await updateUser(updatedData); // Call API
      console.log("API Response:", response);

      if (response?.success) {
        alert("User updated successfully!");
        setOpen(false); // Close the modal on success
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="Title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              className="w-full rounded"
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />
          </div>

          {isLoading || isUpdating ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                label="Submit"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;

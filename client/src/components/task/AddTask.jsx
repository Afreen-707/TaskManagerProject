import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import Button from "../Button";
import { addTasks } from "../../utils/api";
import clsx from "clsx";
const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, onAddTask }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORIRY[2]);
  const [assets, setAssets] = useState([]);
  const [title, settitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [date, setdate] = useState("");
  
  

  const handleSelect = (e) => {
    setAssets(Array.from(e.target.files));
  };

  const submitHandler = async () => {
    try {
      setUploading(true);

      // Create FormData for file uploads
      // const formData = new FormData();
      // formData.append("title", data.title);
      // formData.append("date", data.date);
      // formData.append("stage", stage);
      // formData.append("priority", priority);
      // formData.append("team", JSON.stringify(team));
      // assets.forEach((file) => formData.append("assets", file));
      let stageData = stage;
      addTasks({
        title: title,
        priority: priority.toLowerCase(),
        stage: stage.toLowerCase(),
        assigned:[],
        subtask:[],
        team:JSON.stringify(team)
      });

      // Send POST request to backend
      // const response = await axios.post("http://localhost:8800/addTask", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      // Call parent callback to update tasks
      // onAddTask(response.data);
      setOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          ADD TASK
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          {/* Task Title */}
          {/* <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            setOnChange={setTitle}
            register={register("title", { required: "Title is required" })}
            error={errors.title ? errors.title.message : ""}
          /> */}

          <input
            type="text"
            name="title"
            placeholder="Task Title"
            onChange={(e)=>settitle(e.target.value)}
            className={clsx(
              "bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300"
            )}
          />

          {/* User List */}
          <UserList setTeam={setTeam} team={team} />

          {/* Task Stage and Date */}
          <div className="flex gap-4">
            <SelectList
              label="Task Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />

            <Textbox
            onChange={(e)=>setdate(e.target.value)}
              placeholder="Date"
              type="date"
              name="date"
              label="Task Date"
              className="w-full rounded"
              register={register("date", { required: "Date is required!" })}
              error={errors.date ? errors.date.message : ""}
            />
          </div>

          {/* Priority and Assets */}
          <div className="flex gap-4">
            <SelectList
              label="Priority Level"
              lists={PRIORIRY}
              selected={priority}
              setSelected={setPriority}
            />

            {/* <div className="w-full flex items-center justify-center mt-4">
              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                htmlFor="imgUpload"
              >
                <input
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={handleSelect}
                  accept=".jpg, .png, .jpeg"
                  multiple={true}
                />
                <BiImages />
                <span>Add Assets</span>
              </label>
            </div> */}
          </div>

          {/* Buttons */}
          <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
            <Button
              label={uploading ? "Uploading..." : "Submit"}
              type="submit"
              disabled={uploading}
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
            />

            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;

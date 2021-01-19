import { Polyline } from "@react-google-maps/api";
import React from "react";
import { useForm } from "react-hook-form";

const MovementForm = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name="origin-lat" ref={register} />
      <input name="origin-lng" ref={register} />
      <input name="destination-lat" ref={register} />
      <input name="destination-lng" ref={register} />
      <input name="description" ref={register} />
      <input type="submit" />
    </form>
  );
};

export default MovementForm;

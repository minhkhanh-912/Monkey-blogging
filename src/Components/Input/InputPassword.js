import React, { useState } from "react";
import IconEyeClose from "../icon/IconEyeClose";
import IconEyeOpen from "../icon/IconEyeOpen";
import Input from "./Input";

const InputPassword = ({control,...rest}) => {
    const [togglePassword, settogglePassword] = useState(false);
  return (
    <>
      <Input
        type={togglePassword ? "text" : "password"}
        placeholder="Please enter your password"
        control={control}
        {...rest}>
        {!togglePassword ? (
          <IconEyeClose onClick={() => settogglePassword(true)}></IconEyeClose>
        ) : (
          <IconEyeOpen onClick={() => settogglePassword(false)}></IconEyeOpen>
        )}
      </Input>
    </>
  );
};

export default InputPassword;

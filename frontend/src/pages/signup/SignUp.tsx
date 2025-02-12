import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { FormEvent, useState } from "react";
import useSignUp from "../../hooks/useSignUp";
//import { FaRegEyeSlash } from "react-icons/fa6";
//import { FaRegEye } from "react-icons/fa6";
//import { Icon } from "react-icons-kit";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    termsAndConditions: false,
  });

  const { loading, signup } = useSignUp();
  const handleCheckBoxChange = (gender: string) => {
    setInputs({ ...inputs, gender });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signup(inputs);
  };
  return (
    <div className="flex flex-col justify-center items-center min-w-96">
      <div className="h-full p-6 w-full bg-green-100 rounded-[2rem] bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Uche
          <span className="text-blue-500"> Chat-App</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">First Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter First Name"
              className="w-full input input-bordered h-10"
              value={inputs.firstName}
              onChange={(e) => {
                setInputs({ ...inputs, firstName: e.target.value });
              }}
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Last Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter Last Name"
              className="w-full input input-bordered h-10"
              value={inputs.lastName}
              onChange={(e) => {
                setInputs({ ...inputs, lastName: e.target.value });
              }}
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full input input-bordered h-10"
              value={inputs.email}
              onChange={(e) => {
                setInputs({ ...inputs, email: e.target.value });
              }}
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered h-10"
              value={inputs.password}
              onChange={(e) => {
                setInputs({ ...inputs, password: e.target.value });
              }}
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Confirm password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password Again"
              className="w-full input input-bordered h-10"
              value={inputs.confirmPassword}
              onChange={(e) => {
                setInputs({ ...inputs, confirmPassword: e.target.value });
              }}
            />
          </div>
          <GenderCheckbox
            onCheckBoxChange={handleCheckBoxChange}
            selectedGender={inputs.gender}
          />
          <div>
            <Link
              to="/login"
              className="text-sm  hover:underline hover:text-blue-600 mt-2 inline-block"
            >
              Already have an account?
            </Link>
          </div>
          <div>
            <button className="btn btn-block btn-sm mt-2" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

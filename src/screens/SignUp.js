import { useMutation } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gql from "graphql-tag";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import { FatLink } from "../components/shared";
import routes from "../routes";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $userName: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      userName: $userName
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const history = useHistory();
  const onCompleted = (data) => {
    const { userName, password } = getValues();
    const {
      createAccount: { ok },
    } = data;
    if (!ok) {
      return;
    }
    //if no error, redirect to home with state
    history.push(routes.home, {
      message: "Account created.",
      userName,
      password,
    });
  };
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const { register, handleSubmit, errors, formState, clearErrors, getValues } =
    useForm({
      mode: "onChange",
    });
  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    createAccount({
      variables: {
        ...data,
      },
    });
  };
  const clearSignUpError = () => {
    clearErrors("result");
  };
  return (
    <AuthLayout>
      <PageTitle title="Sign Up" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your friends.
          </Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <FormError message={errors?.firstName?.message} />
          <Input
            ref={register({
              required: "First name is required.",
            })}
            name="firstName"
            type="text"
            placeholder="First Name"
            onFocus={clearSignUpError}
            hasError={Boolean(errors?.firstName?.message)}
          />
          <Input
            ref={register()}
            name="lastName"
            type="text"
            placeholder="Last Name"
            onFocus={clearSignUpError}
          />
          <FormError message={errors?.email?.message} />
          <Input
            ref={register({
              required: "E-mail is required.",
            })}
            name="email"
            type="text"
            placeholder="Email"
            onFocus={clearSignUpError}
            hasError={Boolean(errors?.email?.message)}
          />
          <FormError message={errors?.userName?.message} />
          <Input
            ref={register({
              required: "Username is required.",
            })}
            name="userName"
            type="text"
            placeholder="Username"
            onFocus={clearSignUpError}
            hasError={Boolean(errors?.userName?.message)}
          />
          <FormError message={errors?.password?.message} />
          <Input
            ref={register({
              required: "Password is required.",
            })}
            name="password"
            type="password"
            placeholder="Password"
            onFocus={clearSignUpError}
            hasError={Boolean(errors?.password?.message)}
          />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign Up"}
            disabled={!formState.isValid || loading}
          />
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" link={routes.home} linkText="Log in" />
    </AuthLayout>
  );
}

export default SignUp;

import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { login, createUserSession } from "~/utils/session.server";

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

function validateUrl(url: any) {
  let urls = ["/", "/excercises", "/workouts"];
  if (urls.includes(url)) {
    return url;
  }
  return "/";
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = validateUrl(form.get("redirectTo") || "/jokes");
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const user = await login({ username, password });
  console.log({ user });
  if (!user) {
    return badRequest({
      fields,
      formError: `Username/Password combination is incorrect`,
    });
  }
  return createUserSession(user.id, redirectTo);
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  // const [state, setState] = useState({ action: "login" });

  // const changeAction = (e: React.MouseEvent<HTMLInputElement>): void => {
  //   setState({ ...state, action: e.currentTarget.value });
  // };

  return (
    <div className="flex flex-col pt-4" data-light="">
      <form
        method="post"
        className="grid grid-cols-1 gap-4 mx-auto justify-items-center"
      >
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") ?? undefined}
        />
        {/* <fieldset className="grid grid-cols-2">
          <legend className="sr-only">Login or Register?</legend>
          <label>
            <input
              type="radio"
              name="loginType"
              value="login"
              onClick={changeAction}
              defaultChecked={
                !actionData?.fields?.loginType ||
                actionData?.fields?.loginType === "login"
              }
            />{" "}
            Login
          </label>
          <label>
            <input
              type="radio"
              name="loginType"
              value="register"
              onClick={changeAction}
              defaultChecked={actionData?.fields?.loginType === "register"}
            />{" "}
            Register
          </label>
        </fieldset> */}
        <div className="grid grid-cols-2 justify-items-center">
          <label htmlFor="username-input">Username :</label>
          <input
            type="text"
            id="username-input"
            name="username"
            defaultValue={actionData?.fields?.username}
            aria-invalid={Boolean(actionData?.fieldErrors?.username)}
            aria-errormessage={
              actionData?.fieldErrors?.username ? "username-error" : undefined
            }
          />
          {actionData?.fieldErrors?.username ? (
            <p
              className="form-validation-error"
              role="alert"
              id="username-error"
            >
              {actionData.fieldErrors.username}
            </p>
          ) : null}
        </div>
        {/* {state.action === "register" && (
          <div>
            <label htmlFor="username-input">Email</label>
            <input
              type="email"
              id="email-input"
              name="email"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? "email-error" : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="email-error"
              >
                {actionData.fieldErrors.email}
              </p>
            ) : null}
          </div>
        )} */}
        <div className="grid grid-cols-2 justify-items-center">
          <label htmlFor="password-input">Password :</label>
          <input
            id="password-input"
            name="password"
            defaultValue={actionData?.fields?.password}
            type="password"
            aria-invalid={
              Boolean(actionData?.fieldErrors?.password) || undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.password ? "password-error" : undefined
            }
          />
          {actionData?.fieldErrors?.password ? (
            <p
              className="form-validation-error"
              role="alert"
              id="password-error"
            >
              {actionData.fieldErrors.password}
            </p>
          ) : null}
        </div>
        <div id="form-error-message">
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
        </div>
        <button type="submit" className="button-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

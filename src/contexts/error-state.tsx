import { OverlayToaster, Toast } from "@blueprintjs/core";
import React, { createContext, PropsWithChildren, useState } from "react";

export type ErrorContext = {
  errors: string[];
  addError: (error: string) => void;
};

export const ErrorContext = createContext<ErrorContext>({
  errors: [],
  addError: () => {},
});

export const ErrorContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <ErrorContext.Provider
      value={{
        errors,
        addError: (error: string) => {
          console.log(error);
          setErrors([...errors, error]);
        },
      }}
    >
      {children}
      {errors.length > 0 && (
        <OverlayToaster>
          {errors.map((error, idx) => (
            <Toast
              key={idx}
              intent="danger"
              message={error}
              timeout={2000}
              onDismiss={() =>
                setErrors([...errors.slice(0, idx), ...errors.slice(idx + 1)])
              }
            />
          ))}
        </OverlayToaster>
      )}
    </ErrorContext.Provider>
  );
};

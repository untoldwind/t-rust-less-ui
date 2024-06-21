import { useEffect, useState } from "react";
import { Result, ServiceError } from "./bindings";
import { VariantType, useSnackbar } from "notistack";

export function errorToSnackbar(error: any): {
  message: string;
  variant: VariantType;
} {
  return {
    message: error.toString(),
    variant: "error",
  };
}

export function serviceErrorToSnackbar(error: ServiceError): {
  message: string;
  variant: VariantType;
} {
  return {
    message: JSON.stringify(error),
    variant: "error",
  };
}

export function useBackend<T>(
  command: () => Promise<Result<T, ServiceError>> | undefined,
  dependencies: any[] = [],
): [T | undefined, boolean, () => void] {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  function refresh() {
    const pendingResult = command();
    if (pendingResult === undefined) return;
    setLoading(true);
    pendingResult.then(
      (result) => {
        setLoading(false);
        if (result.status === "ok") {
          setData(result.data);
        } else {
          enqueueSnackbar(serviceErrorToSnackbar(result.error));
        }
      },
      (error) => {
        setLoading(false);
        enqueueSnackbar(errorToSnackbar(error));
      },
    );
  }

  useEffect(() => {
    refresh();
  }, dependencies);

  return [data, loading, refresh];
}

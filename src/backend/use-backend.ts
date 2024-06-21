import { useEffect, useState } from "react";
import { Result, ServiceError } from "./bindings";
import { useSnackbar } from "notistack";

export function useBackend<T>(
  command: () => Promise<Result<T, ServiceError>> | undefined,
  dependencies: any[] = []
): [T | undefined, boolean] {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pendingResult = command();
    if (pendingResult === undefined) return;
    setLoading(true);
    pendingResult.then(
      (result) => {
        setLoading(false);
        if (result.status === "ok") {
          setData(result.data);
        } else {
          enqueueSnackbar({
            message: JSON.stringify(result.error),
            variant: "error",
          });
        }
      },
      (error) => {
        setLoading(false);
        enqueueSnackbar({ message: error.message, variant: "error" });
      }
    );
  }, dependencies);

  return [data, loading];
}

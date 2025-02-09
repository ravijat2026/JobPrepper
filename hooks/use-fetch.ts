import { useState } from "react";
import { toast } from "sonner";

type FetchFunction = (...args: any[]) => Promise<any>;

const useFetch = (cb: FetchFunction) => {
  const [data, setData] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error: any) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;

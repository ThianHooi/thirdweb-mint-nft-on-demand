const handleFetchErrors = async (response: Response) => {
  if (!response.ok) {
    const errorMessage = await response.json();
    throw Error(errorMessage.error);
  }
  return response;
};

export default handleFetchErrors;

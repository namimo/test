export default (info: any, path: string[]): string[] | undefined => {
  const nodes: any[] = info.fieldNodes[0].selectionSet.selections;
  const values = nodes.map((node: any) => node.name.value);

  const result: any[] = values.filter((val: string) => path.includes(val));

  return result.length === 0 ? undefined : result;
};

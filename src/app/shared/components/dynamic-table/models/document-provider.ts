export abstract class DocumentProvider {
  getDocuments: (args: any) => Promise<any[]>
}
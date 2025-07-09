import ReportService from '../../services/ReportsService';

export const ViewFile = (filePath) => {
// const location=useLocation();
// const filePath=location.state.filePath;
    const normalizedPath = filePath.replace(/\\/g, '/');
    const filepath = encodeURIComponent(normalizedPath);

    ReportService.viewDownloadFile(
      filepath,
      async (response) => {

        const contentType = response.headers['content-type'];
        if (response.status < 200 || response.status >= 300) {
          console.error(`Server error: ${response.status}`, response.data);
          return;
        }

        if (contentType !== 'application/pdf') {
          console.error('Expected PDF but got:', contentType, response.data?.slice(0, 200));
          return;
        }

        //  console.log('Blob:', response.data); 
        const blob = response.data;

        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');

        setTimeout(() => window.URL.revokeObjectURL(url), 10000);

      },
      (error) => {
        console.error('Download error:', error);
      }
    );
}


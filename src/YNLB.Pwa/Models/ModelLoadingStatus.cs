namespace YNLB.Pwa.Models;

public record ModelLoadingStatus
(
    string Status,
    string Name,
    string File,
    int Progress
);

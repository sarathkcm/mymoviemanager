(function () {
    angular.module('MyMovieManager')
        .controller('StartupController', function ($scope, $timeout, MediaService) {
            $scope.IsFirstStart = false;
            $scope.WizardStep = 0;
            $scope.newFolder = {
                Recursive: true
            };
            $scope.Folders = [];
            $scope.Initialize = function () {
                var settings = GetJSONFromFile(settingsFile);
                $scope.IsFirstStart = settings.IsFirstStart;
                if ($scope.IsFirstStart) {
                    $scope.Folders = GetJSONFromFile(watchedFoldersFile);
                    return;
                }
                $scope.Data.AllMedia = MediaService.GetMediaList();
                $scope.RefreshMediaDisplay();


                $timeout(triggerScanningOnStartup, 3000)
                return;
            };

            $scope.LoadMediaListFromDisk = function () {
                $scope.Data.AllMedia = MediaService.GetMediaList();
                $scope.RefreshMediaDisplay();
            };

            var triggerScanningOnStartup = function () {
                MediaService.ScanMediaFiles(function (params) {
                    var allMedia = MediaService.GetMediaList();
                    var notUpdatedMediaList = _(allMedia).filter(media => !media.isupdatedonce);
                    $scope.LoadMediaListFromDisk();

                    var save = function () {
                        var groups = _(allMedia).groupBy(media => media.$$Folder.Path);
                        _(_(groups).keys()).each(function (key) {
                            MediaService.SaveMediaListToFile(key, groups[key])
                        });
                        $scope.LoadMediaListFromDisk();
                    };
                    MediaService.UpdateMediaMetaData(notUpdatedMediaList, $scope.ScanProgress, save);
                });

            };

            $scope.SetPage = function (page) {
                $scope.WizardStep = page;
            };
            $scope.ChooseFolder = function (folder) {
                var remote = require('remote');
                var dialog = remote.require('dialog');
                var paths = dialog.showOpenDialog({
                    properties: ['openDirectory']
                });
                if (paths && paths[0])
                    folder.Path = paths[0];
            }
            $scope.AddFolder = function (folder) {
                if (!folder.Path)
                    return;
                $scope.Folders.push(folder);
                $scope.newFolder = {
                    Recursive: true
                };
            }
            $scope.RemoveFolder = function (folder) {
                $scope.Folders.splice($scope.Folders.indexOf(folder), 1);
            }
            $scope.SaveFolderListToFile = function () {
                var folderList = GetJSONFromFile(watchedFoldersFile);
                folderList = $scope.Folders;
                SaveJSONToFile(watchedFoldersFile, folderList);
            }

            $scope.Finalize = function () {
                var settings = GetJSONFromFile(settingsFile);
                settings.IsFirstStart = undefined;
                SaveJSONToFile(settingsFile, settings);
                $scope.Data.AllMedia = MediaService.GetMediaList();
                $scope.RefreshMediaDisplay();
                $scope.IsFirstStart = false;
            };
        });

})();
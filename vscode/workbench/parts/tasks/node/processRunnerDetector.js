define(["require", "exports", "vs/nls", "vs/base/common/objects", "vs/base/common/paths", "vs/base/common/strings", "vs/base/common/processes", "vs/base/node/processes", "../common/tasks"], function (require, exports, nls, Objects, Paths, Strings, processes_1, processes_2, Tasks) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var build = 'build';
    var test = 'test';
    var defaultValue = 'default';
    var RegexpTaskMatcher = (function () {
        function RegexpTaskMatcher(regExp) {
            this.regexp = regExp;
        }
        RegexpTaskMatcher.prototype.init = function () {
        };
        RegexpTaskMatcher.prototype.match = function (tasks, line) {
            var matches = this.regexp.exec(line);
            if (matches && matches.length > 0) {
                tasks.push(matches[1]);
            }
        };
        return RegexpTaskMatcher;
    }());
    var GruntTaskMatcher = (function () {
        function GruntTaskMatcher() {
        }
        GruntTaskMatcher.prototype.init = function () {
            this.tasksStart = false;
            this.tasksEnd = false;
            this.descriptionOffset = null;
        };
        GruntTaskMatcher.prototype.match = function (tasks, line) {
            // grunt lists tasks as follows (description is wrapped into a new line if too long):
            // ...
            // Available tasks
            //         uglify  Minify files with UglifyJS. *
            //         jshint  Validate files with JSHint. *
            //           test  Alias for "jshint", "qunit" tasks.
            //        default  Alias for "jshint", "qunit", "concat", "uglify" tasks.
            //           long  Alias for "eslint", "qunit", "browserify", "sass",
            //                 "autoprefixer", "uglify", tasks.
            //
            // Tasks run in the order specified
            if (!this.tasksStart && !this.tasksEnd) {
                if (line.indexOf('Available tasks') === 0) {
                    this.tasksStart = true;
                }
            }
            else if (this.tasksStart && !this.tasksEnd) {
                if (line.indexOf('Tasks run in the order specified') === 0) {
                    this.tasksEnd = true;
                }
                else {
                    if (this.descriptionOffset === null) {
                        this.descriptionOffset = line.match(/\S  \S/).index + 1;
                    }
                    var taskName = line.substr(0, this.descriptionOffset).trim();
                    if (taskName.length > 0) {
                        tasks.push(taskName);
                    }
                }
            }
        };
        return GruntTaskMatcher;
    }());
    var ProcessRunnerDetector = (function () {
        function ProcessRunnerDetector(fileService, contextService, configurationResolverService, config) {
            if (config === void 0) { config = null; }
            this.fileService = fileService;
            this.contextService = contextService;
            this.configurationResolverService = configurationResolverService;
            this.taskConfiguration = config;
            this._stderr = [];
            this._stdout = [];
            this._cwd = this.contextService.hasWorkspace() ? Paths.normalize(this.contextService.getLegacyWorkspace().resource.fsPath, true) : '';
        }
        ProcessRunnerDetector.supports = function (runner) {
            return ProcessRunnerDetector.SupportedRunners[runner];
        };
        ProcessRunnerDetector.detectorConfig = function (runner) {
            return ProcessRunnerDetector.TaskMatchers[runner];
        };
        Object.defineProperty(ProcessRunnerDetector.prototype, "stderr", {
            get: function () {
                return this._stderr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProcessRunnerDetector.prototype, "stdout", {
            get: function () {
                return this._stdout;
            },
            enumerable: true,
            configurable: true
        });
        ProcessRunnerDetector.prototype.detect = function (list, detectSpecific) {
            var _this = this;
            if (list === void 0) { list = false; }
            if (this.taskConfiguration && this.taskConfiguration.command && ProcessRunnerDetector.supports(this.taskConfiguration.command)) {
                var config = ProcessRunnerDetector.detectorConfig(this.taskConfiguration.command);
                var args = (this.taskConfiguration.args || []).concat(config.arg);
                var options = this.taskConfiguration.options ? this.resolveCommandOptions(this.taskConfiguration.options) : { cwd: this._cwd };
                var isShellCommand = !!this.taskConfiguration.isShellCommand;
                // TODO@Dirk adopt new configuration resolver service https://github.com/Microsoft/vscode/issues/31365
                return this.runDetection(new processes_2.LineProcess(this.taskConfiguration.command, this.configurationResolverService.resolve(this.contextService.getLegacyWorkspace().resource, args), isShellCommand, options), this.taskConfiguration.command, isShellCommand, config.matcher, ProcessRunnerDetector.DefaultProblemMatchers, list);
            }
            else {
                if (detectSpecific) {
                    var detectorPromise = void 0;
                    if ('gulp' === detectSpecific) {
                        detectorPromise = this.tryDetectGulp(list);
                    }
                    else if ('jake' === detectSpecific) {
                        detectorPromise = this.tryDetectJake(list);
                    }
                    else if ('grunt' === detectSpecific) {
                        detectorPromise = this.tryDetectGrunt(list);
                    }
                    return detectorPromise.then(function (value) {
                        if (value) {
                            return value;
                        }
                        else {
                            return { config: null, stdout: _this.stdout, stderr: _this.stderr };
                        }
                    });
                }
                else {
                    return this.tryDetectGulp(list).then(function (value) {
                        if (value) {
                            return value;
                        }
                        return _this.tryDetectJake(list).then(function (value) {
                            if (value) {
                                return value;
                            }
                            return _this.tryDetectGrunt(list).then(function (value) {
                                if (value) {
                                    return value;
                                }
                                return { config: null, stdout: _this.stdout, stderr: _this.stderr };
                            });
                        });
                    });
                }
            }
        };
        ProcessRunnerDetector.prototype.resolveCommandOptions = function (options) {
            // TODO@Dirk adopt new configuration resolver service https://github.com/Microsoft/vscode/issues/31365
            var result = Objects.clone(options);
            if (result.cwd) {
                result.cwd = this.configurationResolverService.resolve(this.contextService.getLegacyWorkspace().resource, result.cwd);
            }
            if (result.env) {
                result.env = this.configurationResolverService.resolve(this.contextService.getLegacyWorkspace().resource, result.env);
            }
            return result;
        };
        ProcessRunnerDetector.prototype.tryDetectGulp = function (list) {
            var _this = this;
            return this.fileService.resolveFile(this.contextService.toResource('gulpfile.js')).then(function (stat) {
                var config = ProcessRunnerDetector.detectorConfig('gulp');
                var process = new processes_2.LineProcess('gulp', [config.arg, '--no-color'], true, { cwd: _this._cwd });
                return _this.runDetection(process, 'gulp', true, config.matcher, ProcessRunnerDetector.DefaultProblemMatchers, list);
            }, function (err) {
                return null;
            });
        };
        ProcessRunnerDetector.prototype.tryDetectGrunt = function (list) {
            var _this = this;
            return this.fileService.resolveFile(this.contextService.toResource('Gruntfile.js')).then(function (stat) {
                var config = ProcessRunnerDetector.detectorConfig('grunt');
                var process = new processes_2.LineProcess('grunt', [config.arg, '--no-color'], true, { cwd: _this._cwd });
                return _this.runDetection(process, 'grunt', true, config.matcher, ProcessRunnerDetector.DefaultProblemMatchers, list);
            }, function (err) {
                return null;
            });
        };
        ProcessRunnerDetector.prototype.tryDetectJake = function (list) {
            var _this = this;
            var run = function () {
                var config = ProcessRunnerDetector.detectorConfig('jake');
                var process = new processes_2.LineProcess('jake', [config.arg], true, { cwd: _this._cwd });
                return _this.runDetection(process, 'jake', true, config.matcher, ProcessRunnerDetector.DefaultProblemMatchers, list);
            };
            return this.fileService.resolveFile(this.contextService.toResource('Jakefile')).then(function (stat) {
                return run();
            }, function (err) {
                return _this.fileService.resolveFile(_this.contextService.toResource('Jakefile.js')).then(function (stat) {
                    return run();
                }, function (err) {
                    return null;
                });
            });
        };
        ProcessRunnerDetector.prototype.runDetection = function (process, command, isShellCommand, matcher, problemMatchers, list) {
            var _this = this;
            var tasks = [];
            matcher.init();
            return process.start().then(function (success) {
                if (tasks.length === 0) {
                    if (success.cmdCode !== 0) {
                        if (command === 'gulp') {
                            _this._stderr.push(nls.localize('TaskSystemDetector.noGulpTasks', 'Running gulp --tasks-simple didn\'t list any tasks. Did you run npm install?'));
                        }
                        else if (command === 'jake') {
                            _this._stderr.push(nls.localize('TaskSystemDetector.noJakeTasks', 'Running jake --tasks didn\'t list any tasks. Did you run npm install?'));
                        }
                    }
                    return { config: null, stdout: _this._stdout, stderr: _this._stderr };
                }
                var result = {
                    version: ProcessRunnerDetector.Version,
                    command: command,
                    isShellCommand: isShellCommand
                };
                // Hack. We need to remove this.
                if (command === 'gulp') {
                    result.args = ['--no-color'];
                }
                result.tasks = _this.createTaskDescriptions(tasks, problemMatchers, list);
                return { config: result, stdout: _this._stdout, stderr: _this._stderr };
            }, function (err) {
                var error = err.error;
                if (error.code === 'ENOENT') {
                    if (command === 'gulp') {
                        _this._stderr.push(nls.localize('TaskSystemDetector.noGulpProgram', 'Gulp is not installed on your system. Run npm install -g gulp to install it.'));
                    }
                    else if (command === 'jake') {
                        _this._stderr.push(nls.localize('TaskSystemDetector.noJakeProgram', 'Jake is not installed on your system. Run npm install -g jake to install it.'));
                    }
                    else if (command === 'grunt') {
                        _this._stderr.push(nls.localize('TaskSystemDetector.noGruntProgram', 'Grunt is not installed on your system. Run npm install -g grunt to install it.'));
                    }
                }
                else {
                    _this._stderr.push(nls.localize('TaskSystemDetector.noProgram', 'Program {0} was not found. Message is {1}', command, error.message));
                }
                return { config: null, stdout: _this._stdout, stderr: _this._stderr };
            }, function (progress) {
                if (progress.source === processes_1.Source.stderr) {
                    _this._stderr.push(progress.line);
                    return;
                }
                var line = Strings.removeAnsiEscapeCodes(progress.line);
                var matches = matcher.match(tasks, line);
                if (matches && matches.length > 0) {
                    tasks.push(matches[1]);
                }
            });
        };
        ProcessRunnerDetector.prototype.createTaskDescriptions = function (tasks, problemMatchers, list) {
            var _this = this;
            var taskConfigs = [];
            if (list) {
                tasks.forEach(function (task) {
                    taskConfigs.push({
                        taskName: task,
                        args: []
                    });
                });
            }
            else {
                var taskInfos_1 = {
                    build: { index: -1, exact: -1 },
                    test: { index: -1, exact: -1 }
                };
                tasks.forEach(function (task, index) {
                    _this.testBuild(taskInfos_1.build, task, index);
                    _this.testTest(taskInfos_1.test, task, index);
                });
                if (taskInfos_1.build.index !== -1) {
                    var name_1 = tasks[taskInfos_1.build.index];
                    this._stdout.push(nls.localize('TaskSystemDetector.buildTaskDetected', 'Build task named \'{0}\' detected.', name_1));
                    taskConfigs.push({
                        taskName: name_1,
                        args: [],
                        group: Tasks.TaskGroup.Build,
                        problemMatcher: problemMatchers
                    });
                }
                if (taskInfos_1.test.index !== -1) {
                    var name_2 = tasks[taskInfos_1.test.index];
                    this._stdout.push(nls.localize('TaskSystemDetector.testTaskDetected', 'Test task named \'{0}\' detected.', name_2));
                    taskConfigs.push({
                        taskName: name_2,
                        args: [],
                        group: Tasks.TaskGroup.Test,
                    });
                }
            }
            return taskConfigs;
        };
        ProcessRunnerDetector.prototype.testBuild = function (taskInfo, taskName, index) {
            if (taskName === build) {
                taskInfo.index = index;
                taskInfo.exact = 4;
            }
            else if ((Strings.startsWith(taskName, build) || Strings.endsWith(taskName, build)) && taskInfo.exact < 4) {
                taskInfo.index = index;
                taskInfo.exact = 3;
            }
            else if (taskName.indexOf(build) !== -1 && taskInfo.exact < 3) {
                taskInfo.index = index;
                taskInfo.exact = 2;
            }
            else if (taskName === defaultValue && taskInfo.exact < 2) {
                taskInfo.index = index;
                taskInfo.exact = 1;
            }
        };
        ProcessRunnerDetector.prototype.testTest = function (taskInfo, taskName, index) {
            if (taskName === test) {
                taskInfo.index = index;
                taskInfo.exact = 3;
            }
            else if ((Strings.startsWith(taskName, test) || Strings.endsWith(taskName, test)) && taskInfo.exact < 3) {
                taskInfo.index = index;
                taskInfo.exact = 2;
            }
            else if (taskName.indexOf(test) !== -1 && taskInfo.exact < 2) {
                taskInfo.index = index;
                taskInfo.exact = 1;
            }
        };
        ProcessRunnerDetector.Version = '0.1.0';
        ProcessRunnerDetector.SupportedRunners = {
            'gulp': true,
            'jake': true,
            'grunt': true
        };
        ProcessRunnerDetector.TaskMatchers = {
            'gulp': { matcher: new RegexpTaskMatcher(/^(.*)$/), arg: '--tasks-simple' },
            'jake': { matcher: new RegexpTaskMatcher(/^jake\s+([^\s]+)\s/), arg: '--tasks' },
            'grunt': { matcher: new GruntTaskMatcher(), arg: '--help' },
        };
        ProcessRunnerDetector.DefaultProblemMatchers = ['$lessCompile', '$tsc', '$jshint'];
        return ProcessRunnerDetector;
    }());
    exports.ProcessRunnerDetector = ProcessRunnerDetector;
});
//# sourceMappingURL=processRunnerDetector.js.map
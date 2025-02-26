{
    // Функция для преобразования строки времени в кадры
    function timeToFrames(timeString, fps) {
        var parts = timeString.split(":");
        var hours = parseInt(parts[0]);
        var minutes = parseInt(parts[1]);
        var seconds = parseInt(parts[2]);
        var frames = parseInt(parts[3]);
        return (hours * 3600 + minutes * 60 + seconds) * fps + frames;
    }

    // Функция для преобразования кадров в строку времени
    function framesToTime(frames, fps) {
        var totalSeconds = Math.floor(frames / fps);
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;
        var frame = frames % fps;
        return hours + ":" + pad(minutes) + ":" + pad(seconds) + ":" + pad(frame);
    }

    // Вспомогательная функция для добавления ведущего нуля
    function pad(num) {
        return num < 10 ? "0" + num : num.toString();
    }

    // Основная функция
    function changeCompDuration(newDurationStr) {
        // Получаем текущий проект и выбранные элементы
        var proj = app.project;
        var selectedItems = proj.selection;

        if (selectedItems.length === 0) {
            alert("Not a single composition was selected!");
            return;
        }

        try {
            for (var i = 0; i < selectedItems.length; i++) {
                var item = selectedItems[i];
                if (item instanceof CompItem) {
                    // Получаем FPS текущей композиции
                    var fps = item.frameRate;

                    // Преобразуем введенное время в кадры относительно FPS композиции
                    var newDurationFrames = timeToFrames(newDurationStr, fps);

                    // Изменяем длительность композиции
                    item.duration = newDurationFrames / fps;
                }
            }
        } catch (e) {
            alert(e.message);
        }

        alert("The time of all compositions has been successfully changed to " + newDurationStr)
    }

    // Создаем UI
    function createUI() {
        var window = new Window("palette", "Time Conveyor | by Michael Mohonov", undefined);
        window.orientation = "column";

        var firstRow = window.add("group");
        firstRow.orentation = "row"
        firstRow.alignment = "left"

        // Поле ввода для длительности
        var durationInput = firstRow.add("edittext", undefined, "0:00:05:00");
        durationInput.characters = 10; // Ограничиваем длину ввода
        durationInput.helpTip = "Enter the duration in the format H:MM:SS:FF";

        // Кнопка для применения изменений
        var applyButton = firstRow.add("button", undefined, "Apply");
        applyButton.onClick = function () {
            var newDurationStr = durationInput.text;
            if (!newDurationStr.match(/^\d+:\d{2}:\d{2}:\d{2}$/)) {
                alert("Incorrect time format! Use H:MM:SS:FF.");
                return;
            }
            changeCompDuration(newDurationStr);
        };

        var secondRow = window.add("group");
        secondRow.orentation = "row"
        secondRow.alignment = "left"

        // Кнопка для закрытия окна
        var closeButton = secondRow.add("button", undefined, "Close");
        closeButton.onClick = function () {
            window.close();
        };

        window.add('statictext', undefined, 't.me/mohonovschannel');

        // Отображаем окно
        window.show();
    }

    // Запуск UI
    createUI();
}